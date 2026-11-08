import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Download, Copy, Check, FileCode, RotateCcw, Search } from 'lucide-react';
import {
  constitucion_db,
  constitucion_json_puro,
  ArticuloCE,
  ArticuloCasilleroPuro
} from './datos_ce';
import { VANILLA_JS_SOURCE } from './standalone_template';
import { ESTRUCTURA_MAPA_CE, ItemEspecialMapaCE } from './estructura_ce';
import './mesa_juego.css';

const STORAGE_KEY_DOMINADOS = 'ce_articulos_dominados_v1';
const STORAGE_KEY_REPASO = 'ce_articulos_repaso_v1';
const STORAGE_KEY_CAZADOR_ACIERTOS = 'ce_cazador_aciertos_v1';
const STORAGE_KEY_ULTIMO_ACCESO = 'ultimo_acceso';
const STORAGE_KEY_RACHA_ACTUAL = 'racha_actual';
const STORAGE_KEY_MEJOR_RACHA = 'mejor_racha';
const STORAGE_KEY_ARTICULOS_FALLOS = 'articulos_con_fallos';
const STORAGE_KEY_MAPA_FALLOS = 'ce_mapa_fallos_v1';

interface EstadoRacha {
  ultimo_acceso: string;
  racha_actual: number;
  mejor_racha: number;
}

declare global {
  interface Window {
    constitucion_db?: ArticuloCE[];
    constitucion_json_puro?: ArticuloCasilleroPuro[];
  }
}

function formatearFechaLocalISO(fecha = new Date()): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function obtenerFechaAyerISO(fechaRef = new Date()): string {
  const copia = new Date(fechaRef.getFullYear(), fechaRef.getMonth(), fechaRef.getDate());
  copia.setDate(copia.getDate() - 1);
  return formatearFechaLocalISO(copia);
}

function comprobarYActualizarRachaStorage(): EstadoRacha {
  const hoyISO = formatearFechaLocalISO(new Date());
  const ayerISO = obtenerFechaAyerISO(new Date());

  let ultimoAcceso: string | null = null;
  let rachaActual = 0;
  let mejorRacha = 0;

  try {
    ultimoAcceso = localStorage.getItem(STORAGE_KEY_ULTIMO_ACCESO);
    rachaActual = parseInt(localStorage.getItem(STORAGE_KEY_RACHA_ACTUAL) || '0', 10) || 0;
    mejorRacha = parseInt(localStorage.getItem(STORAGE_KEY_MEJOR_RACHA) || '0', 10) || 0;
  } catch {
    // ignore
  }

  if (ultimoAcceso === hoyISO) {
    if (rachaActual <= 0) rachaActual = 1;
  } else if (ultimoAcceso === ayerISO) {
    rachaActual = rachaActual + 1;
  } else {
    rachaActual = 1;
  }

  if (rachaActual > mejorRacha) {
    mejorRacha = rachaActual;
  }

  try {
    localStorage.setItem(STORAGE_KEY_ULTIMO_ACCESO, hoyISO);
    localStorage.setItem(STORAGE_KEY_RACHA_ACTUAL, String(rachaActual));
    localStorage.setItem(STORAGE_KEY_MEJOR_RACHA, String(mejorRacha));
  } catch {
    // ignore
  }

  return {
    ultimo_acceso: hoyISO,
    racha_actual: rachaActual,
    mejor_racha: mejorRacha
  };
}

function leerArticulosDominadosStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOMINADOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

function leerArticulosEnRepasoStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPASO);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

function leerArticulosConFallosStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICULOS_FALLOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

function leerMapaFallosStorage(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MAPA_FALLOS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function registrarFalloArticuloStorage(id: number): {
  fallosIds: number[];
  mapaFallos: Record<number, number>;
} {
  const fallosIds = leerArticulosConFallosStorage();
  if (!fallosIds.includes(id)) {
    fallosIds.push(id);
  }
  const mapaFallos = leerMapaFallosStorage();
  mapaFallos[id] = (Number(mapaFallos[id]) || 0) + 1;

  try {
    localStorage.setItem(STORAGE_KEY_ARTICULOS_FALLOS, JSON.stringify(fallosIds));
    localStorage.setItem(STORAGE_KEY_MAPA_FALLOS, JSON.stringify(mapaFallos));
  } catch {
    // ignore
  }
  marcarArticuloEnRepasoStorage(id);
  return { fallosIds, mapaFallos };
}

function guardarArticuloDominadoStorage(id: number): number[] {
  const actual = leerArticulosDominadosStorage();
  if (!actual.includes(id)) {
    actual.push(id);
    try {
      localStorage.setItem(STORAGE_KEY_DOMINADOS, JSON.stringify(actual));
    } catch {
      // Ignore storage quota errors
    }
  }
  const repaso = leerArticulosEnRepasoStorage().filter((x) => x !== id);
  try {
    localStorage.setItem(STORAGE_KEY_REPASO, JSON.stringify(repaso));
  } catch {
    // Ignore
  }
  return actual;
}

function marcarArticuloEnRepasoStorage(id: number): void {
  if (leerArticulosDominadosStorage().includes(id)) return;
  const repaso = leerArticulosEnRepasoStorage();
  if (!repaso.includes(id)) {
    repaso.push(id);
    try {
      localStorage.setItem(STORAGE_KEY_REPASO, JSON.stringify(repaso));
    } catch {
      // Ignore
    }
  }
}

function establecerEstadoArticuloStorage(
  id: number,
  estado: 'dominado' | 'repaso' | 'no_estudiado'
): number[] {
  const dom = leerArticulosDominadosStorage().filter((x) => x !== id);
  const rep = leerArticulosEnRepasoStorage().filter((x) => x !== id);
  if (estado === 'dominado') dom.push(id);
  else if (estado === 'repaso') rep.push(id);
  try {
    localStorage.setItem(STORAGE_KEY_DOMINADOS, JSON.stringify(dom));
    localStorage.setItem(STORAGE_KEY_REPASO, JSON.stringify(rep));
  } catch {
    // Ignore
  }
  return dom;
}

function obtenerEstadoArticuloStorage(id: number): 'dominado' | 'repaso' | 'no_estudiado' {
  if (leerArticulosDominadosStorage().includes(id)) return 'dominado';
  if (leerArticulosEnRepasoStorage().includes(id)) return 'repaso';
  return 'no_estudiado';
}

function leerAciertosCazadorStorage(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_CAZADOR_ACIERTOS);
    return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

function incrementarAciertosCazadorStorage(): number {
  const nuevo = leerAciertosCazadorStorage() + 1;
  try {
    localStorage.setItem(STORAGE_KEY_CAZADOR_ACIERTOS, String(nuevo));
  } catch {
    // Ignore storage quota errors
  }
  return nuevo;
}

function obtenerRutaImagenArticulo(idArticulo: string | number): string {
  const idLimpio = String(idArticulo).trim();
  return `./assets/images/art_${idLimpio}.jpg`;
}

function barajarArray<T>(array: T[]): T[] {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function App() {
  const [activeView, setActiveView] = useState<'mesa' | 'vanilla_js' | 'datos_ce'>('mesa');
  const [modoActual, setModoActual] = useState<'modo1' | 'modo2' | 'modo3' | 'modo4' | 'mapa'>('modo1');
  const [filtroDominio, setFiltroDominio] = useState<'todos' | 'no_dominados' | 'dominados' | 'con_fallos'>('todos');
  const [dominadosIds, setDominadosIds] = useState<number[]>(() => leerArticulosDominadosStorage());
  const [fallosIds, setFallosIds] = useState<number[]>(() => leerArticulosConFallosStorage());
  const [mapaFallos, setMapaFallos] = useState<Record<number, number>>(() => leerMapaFallosStorage());
  const [rachaInfo, setRachaInfo] = useState<EstadoRacha>(() => comprobarYActualizarRachaStorage());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jsonDisplayMode, setJsonDisplayMode] = useState<'raw_json' | 'fichas'>('raw_json');

  const mesaRef = useRef<HTMLElement | null>(null);
  const indiceDescubrimientoRef = useRef<number>(0);
  const bloquesAbiertosRef = useRef<Set<string>>(new Set(['titulo_preliminar', 'titulo_i']));

  useEffect(() => {
    document.title = 'ConstituSol — Simulador Mnemotécnico de la Constitución Española';
    window.constitucion_db = constitucion_db;
    window.constitucion_json_puro = constitucion_json_puro;
    setRachaInfo(comprobarYActualizarRachaStorage());
  }, []);

  const totalApartadosCount = useMemo(
    () => constitucion_json_puro.reduce((acc, art) => acc + art.apartados.length, 0),
    []
  );

  const filteredJsonArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return constitucion_json_puro;
    return constitucion_json_puro.filter((art) => {
      if (art.id_articulo === q || `art ${art.id_articulo}` === q) return true;
      if (art.tema_general.toLowerCase().includes(q)) return true;
      if (art.palabra_casillero.toLowerCase().includes(q)) return true;
      if (art.historia_mnemotecnica.toLowerCase().includes(q)) return true;
      if (art.test_trampa?.enunciado.toLowerCase().includes(q)) return true;
      if (art.test_trampa?.trampa_explicacion.toLowerCase().includes(q)) return true;
      return art.apartados.some(
        (ap) =>
          ap.id_apartado.toLowerCase().includes(q) ||
          ap.concepto_clave.toLowerCase().includes(q) ||
          ap.texto_oficial.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const pureJsonString = useMemo(
    () => JSON.stringify(filteredJsonArticles, null, 2),
    [filteredJsonArticles]
  );

  const handleResetDominados = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_DOMINADOS);
      localStorage.removeItem(STORAGE_KEY_REPASO);
      localStorage.removeItem(STORAGE_KEY_CAZADOR_ACIERTOS);
      localStorage.removeItem(STORAGE_KEY_ARTICULOS_FALLOS);
      localStorage.removeItem(STORAGE_KEY_MAPA_FALLOS);
    } catch {
      // ignore
    }
    setDominadosIds([]);
    setFallosIds([]);
    setMapaFallos({});
    if (filtroDominio === 'con_fallos') {
      setFiltroDominio('todos');
    }
    indiceDescubrimientoRef.current = 0;
  };

  useEffect(() => {
    if (activeView !== 'mesa') return;
    const contenedorMesa = mesaRef.current;
    if (!contenedorMesa) return;

    let seleccionNumeroId: number | null = null;
    let seleccionConceptoId: number | null = null;
    let parejasResueltas = 0;

    function limpiarMesaDeTrabajo() {
      if (!contenedorMesa) return;
      contenedorMesa.innerHTML = '';
      seleccionNumeroId = null;
      seleccionConceptoId = null;
      parejasResueltas = 0;
    }

    function obtenerMazoFiltrado(): ArticuloCE[] {
      const db = window.constitucion_db || constitucion_db;
      const setDom = new Set(leerArticulosDominadosStorage());
      const setFallos = new Set(leerArticulosConFallosStorage());
      if (filtroDominio === 'dominados') {
        return db.filter((art) => setDom.has(art.id));
      }
      if (filtroDominio === 'no_dominados') {
        return db.filter((art) => !setDom.has(art.id));
      }
      if (filtroDominio === 'con_fallos') {
        return db.filter((art) => setFallos.has(art.id));
      }
      return db;
    }

    function renderizarEstadoVacioFiltro() {
      if (!contenedorMesa) return;
      const etiquetaFiltro =
        filtroDominio === 'dominados'
          ? 'Solo los dominados'
          : filtroDominio === 'con_fallos'
          ? 'Solo artículos con fallos'
          : 'Solo los no dominados';

      const mensajeVacio =
        filtroDominio === 'dominados'
          ? 'Aún no has dominado ningún artículo en ConstituSol. Ve al «Modo 2: El Reto del Casillero» y acierta un artículo al primer intento para marcarlo como dominado en localStorage.'
          : filtroDominio === 'con_fallos'
          ? '¡Excelente trabajo! No tienes artículos registrados con fallos en el Modo Reto ni en el Modo Cazador de Trampas.'
          : '¡Enhorabuena! Has dominado todos los artículos de la Constitución Española en ConstituSol.';

      const cajaVacia = document.createElement('section');
      cajaVacia.className = 'mesa-vacia-card';
      cajaVacia.innerHTML = `
        <h2 class="mesa-vacia-titulo">No hay artículos en el filtro «${etiquetaFiltro}»</h2>
        <p class="mesa-vacia-texto">${mensajeVacio}</p>
        <div class="mesa-vacia-acciones">
          <button type="button" class="btn-mesa btn-mesa-primary" id="btn-volver-todos">
            Ver Todos los Artículos
          </button>
        </div>
      `;
      contenedorMesa.appendChild(cajaVacia);

      contenedorMesa.querySelector('#btn-volver-todos')?.addEventListener('click', () => {
        setFiltroDominio('todos');
      });
    }

    function iniciarModoDescubrimiento(mazo: ArticuloCE[]) {
      if (!contenedorMesa) return;
      if (indiceDescubrimientoRef.current >= mazo.length) {
        indiceDescubrimientoRef.current = 0;
      }
      const start = indiceDescubrimientoRef.current;
      const manoCartas = mazo.slice(start, start + 6);
      const setDom = new Set(leerArticulosDominadosStorage());

      const hud = document.createElement('section');
      hud.className = 'tablero-hud';
      hud.innerHTML = `
        <div class="hud-metrics">
          <span>ConstituSol · Modo 1: Descubrimiento (Flashcards con BOE por Apartados)</span>
          <span class="hud-separator">·</span>
          <span>Mostrando ${start + 1}–${Math.min(start + 6, mazo.length)} de ${mazo.length} artículos</span>
        </div>
        <div class="hud-acciones-inline">
          <button type="button" class="btn-mesa btn-sm" id="btn-prev-mano">← Anteriores</button>
          <button type="button" class="btn-mesa btn-sm" id="btn-rand-mano">Mano Aleatoria</button>
          <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-next-mano">Siguientes →</button>
        </div>
      `;
      contenedorMesa.appendChild(hud);

      const rejilla = document.createElement('section');
      rejilla.className = 'tapete-cartas';

      manoCartas.forEach((articulo) => {
        const dominado = setDom.has(articulo.id);
        const slot = document.createElement('div');
        slot.className = 'flashcard-slot';

        const cardInner = document.createElement('div');
        cardInner.className = 'flashcard-inner';
        cardInner.setAttribute('tabindex', '0');
        cardInner.setAttribute('role', 'button');

        const imagenUrl = obtenerRutaImagenArticulo(articulo.id_articulo);

        const apartadosFrontHtml = articulo.apartados
          .map(
            (ap) => `
              <div class="apartado-front-item">
                <span class="apartado-id-code">${ap.id_apartado}</span>
                <span>${ap.concepto_clave}</span>
              </div>
            `
          )
          .join('');

        const apartadosBackHtml = articulo.apartados
          .map(
            (ap) => `
              <div class="back-apartado-card">
                <div class="back-apartado-top">
                  <div class="back-apartado-info">
                    <span class="back-apartado-badge">Ap. ${ap.id_apartado}</span>
                    <span class="back-apartado-concepto">${ap.concepto_clave}</span>
                  </div>
                  <button
                    type="button"
                    class="btn-ver-boe"
                    data-target-boe="boe-${ap.id_apartado.replace('.', '-')}"
                    aria-expanded="false"
                  >
                    📖 Ver BOE
                  </button>
                </div>
                <div
                  id="boe-${ap.id_apartado.replace('.', '-')}"
                  class="back-apartado-boe-texto is-hidden"
                >${ap.texto_oficial}</div>
              </div>
            `
          )
          .join('');

        cardInner.innerHTML = `
          <div class="card-face card-front">
            <div class="card-corner-top">
              <span class="card-rank"><span class="card-suit">♠</span> Art. ${articulo.id_articulo}</span>
              <span class="card-meta-text">${dominado ? '★ Dominado' : `${articulo.apartados.length} apartado(s)`}</span>
            </div>

            <div class="card-center-stage">
              <div class="casillero-emblem">${articulo.id_articulo}</div>
              <span class="casillero-label">Tema General</span>
              <h2 class="casillero-word">${articulo.tema_general}</h2>
              <div class="apartados-front-list">
                ${apartadosFrontHtml}
              </div>
            </div>

            <div class="card-corner-bottom">
              <span class="flip-prompt-footer">Haz clic para girar y ver mnemotecnia y BOE ↻</span>
            </div>
          </div>

          <div class="card-face card-back">
            <div class="back-header">
              <span class="back-art-number">Art. ${articulo.id_articulo} · ${articulo.tema_general}</span>
              <span class="back-peg-pair">Casillero: <strong>${articulo.palabra_casillero}</strong></span>
            </div>

            <div class="back-body">
              <div class="card-media-frame">
                <img
                  src="${imagenUrl}"
                  alt="Escena surrealista del Artículo ${articulo.id_articulo}: ${articulo.palabra_casillero}"
                  class="card-surreal-img"
                  loading="lazy"
                  onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.classList.remove('is-hidden');"
                />
                <div class="img-fallback-box is-hidden" aria-label="Cuadro de sustitución de escena mnemotécnica">
                  <span class="img-fallback-badge">🎨 Casillero: ${articulo.palabra_casillero}</span>
                  <span class="img-fallback-title">Artículo ${articulo.id_articulo} · ${articulo.tema_general}</span>
                  <span class="img-fallback-sub">./assets/images/art_${articulo.id_articulo}.jpg · Escena en preparación</span>
                </div>
              </div>
              <div class="historia-box">
                <strong>${articulo.palabra_casillero}:</strong> ${articulo.historia_mnemotecnica}
              </div>
              <div class="back-apartados-section">
                <span class="back-apartados-title">Desglose por Apartados (${articulo.apartados.length})</span>
                ${apartadosBackHtml}
              </div>
            </div>

            <div class="back-footer">
              <span>${dominado ? '★ Artículo Dominado' : 'ConstituSol · Sistema Mayor'}</span>
              <span>Clic en tarjeta para volver ↺</span>
            </div>
          </div>
        `;

        // Eventos para alternar la visibilidad del texto oficial del BOE de cada apartado
        const botonesBoe = cardInner.querySelectorAll('.btn-ver-boe');
        botonesBoe.forEach((btnBoe) => {
          btnBoe.addEventListener('click', (e) => {
            e.stopPropagation(); // Impide que la tarjeta se voltee al pulsar "📖 Ver BOE"
            const targetId = btnBoe.getAttribute('data-target-boe');
            const contenedorTextoBoe = targetId ? cardInner.querySelector(`#${targetId}`) : null;
            if (!contenedorTextoBoe) return;

            const estaOculto = contenedorTextoBoe.classList.contains('is-hidden');
            if (estaOculto) {
              contenedorTextoBoe.classList.remove('is-hidden');
              btnBoe.classList.add('is-open');
              btnBoe.setAttribute('aria-expanded', 'true');
              btnBoe.textContent = '📕 Ocultar BOE';
            } else {
              contenedorTextoBoe.classList.add('is-hidden');
              btnBoe.classList.remove('is-open');
              btnBoe.setAttribute('aria-expanded', 'false');
              btnBoe.textContent = '📖 Ver BOE';
            }
          });
        });

        cardInner.querySelectorAll('.back-apartado-boe-texto').forEach((bloqueTexto) => {
          bloqueTexto.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        });

        cardInner.addEventListener('click', () => {
          cardInner.classList.toggle('is-flipped');
        });

        slot.appendChild(cardInner);
        rejilla.appendChild(slot);
      });

      contenedorMesa.appendChild(rejilla);

      contenedorMesa.querySelector('#btn-prev-mano')?.addEventListener('click', () => {
        indiceDescubrimientoRef.current = Math.max(0, indiceDescubrimientoRef.current - 6);
        limpiarMesaDeTrabajo();
        iniciarModoDescubrimiento(obtenerMazoFiltrado());
      });

      contenedorMesa.querySelector('#btn-next-mano')?.addEventListener('click', () => {
        const actualMazo = obtenerMazoFiltrado();
        indiceDescubrimientoRef.current =
          indiceDescubrimientoRef.current + 6 < actualMazo.length
            ? indiceDescubrimientoRef.current + 6
            : 0;
        limpiarMesaDeTrabajo();
        iniciarModoDescubrimiento(actualMazo);
      });

      contenedorMesa.querySelector('#btn-rand-mano')?.addEventListener('click', () => {
        const actualMazo = obtenerMazoFiltrado();
        indiceDescubrimientoRef.current = Math.floor(
          Math.random() * Math.max(1, actualMazo.length - 6)
        );
        limpiarMesaDeTrabajo();
        iniciarModoDescubrimiento(actualMazo);
      });
    }

    function iniciarModoRetoCasillero(mazo: ArticuloCE[]) {
      if (!contenedorMesa) return;
      const articuloReto = mazo[Math.floor(Math.random() * mazo.length)];
      let intentosRealizados = 0;

      const yaEstabaDominado = leerArticulosDominadosStorage().includes(articuloReto.id);

      const hud = document.createElement('section');
      hud.className = 'tablero-hud';
      hud.innerHTML = `
        <div class="hud-metrics">
          <span>ConstituSol · Modo 2: El Reto del Casillero</span>
          <span class="hud-separator">·</span>
          <span>Acierta al 1.er intento para marcar como Artículo Dominado en localStorage</span>
        </div>
        <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-nuevo-reto">
          Siguiente Reto Aleatorio →
        </button>
      `;
      contenedorMesa.appendChild(hud);

      const escenarioReto = document.createElement('section');
      escenarioReto.className = 'reto-contenedor';

      const imagenUrl = obtenerRutaImagenArticulo(articuloReto.id_articulo);

      const apartadosBoeHtml = articuloReto.apartados
        .map((ap, idx) => {
          const subNumero = ap.id_apartado.includes('.')
            ? ap.id_apartado.split('.')[1]
            : String(idx + 1);
          return `
            <div class="reto-boe-apartado-item">
              <div class="reto-boe-apartado-head">
                <span class="reto-boe-apartado-num">Apartado ${subNumero}</span>
                <span class="reto-boe-apartado-resumen">— ${ap.concepto_clave}</span>
              </div>
              <p class="reto-boe-apartado-texto">${ap.texto_oficial}</p>
            </div>
          `;
        })
        .join('');

      const tarjetaReto = document.createElement('article');
      tarjetaReto.className = 'reto-card';

      tarjetaReto.innerHTML = `
        <div class="reto-media-wrapper">
          <img
            src="${imagenUrl}"
            alt="Escena mnemotécnica de ${articuloReto.palabra_casillero}"
            class="reto-imagen"
            loading="lazy"
            onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.classList.remove('is-hidden');"
          />
          <div class="img-fallback-box is-hidden" aria-label="Cuadro de sustitución de escena del reto">
            <span class="img-fallback-badge">🔑 Casillero: ${articuloReto.palabra_casillero}</span>
            <span class="img-fallback-title">¿A qué artículo corresponde esta escena y texto del BOE?</span>
            <span class="img-fallback-sub">./assets/images/art_${articuloReto.id_articulo}.jpg · Escena en preparación</span>
          </div>
        </div>

        <div class="reto-cuerpo">
          <!-- 1. Pista Mnemotécnica: Palabra del Casillero e Historia Absurda -->
          <div class="reto-meta-row">
            <span class="reto-peg-banner">
              🔑 Palabra del Casillero: ${articuloReto.palabra_casillero}
            </span>
            <span class="reto-estado-dominio" id="badge-dominio-actual">
              ${yaEstabaDominado ? '★ Ya Dominado en localStorage' : '○ No dominado aún'}
            </span>
          </div>

          <p class="reto-historia">
            <strong>Historia Mnemotécnica:</strong> ${articuloReto.historia_mnemotecnica}
          </p>

          <!-- 2. Cuadro de Contenido Real y Oficial del Artículo (BOE con sus apartados) -->
          <section class="reto-boe-container" aria-label="Contenido oficial del artículo en el BOE">
            <div class="reto-boe-header">
              <h3 class="reto-boe-title">
                <span>📜</span>
                <span>Contenido Oficial del Artículo (BOE)</span>
              </h3>
              <span class="reto-boe-badge">
                ${articuloReto.apartados.length} ${articuloReto.apartados.length === 1 ? 'apartado oficial' : 'apartados oficiales'}
              </span>
            </div>
            <div class="reto-boe-apartados-list">
              ${apartadosBoeHtml}
            </div>
          </section>

          <!-- 3. Input numérico para adivinar el número de artículo -->
          <form class="reto-formulario" id="form-adivinar-articulo">
            <label for="input-numero-art" class="reto-input-label">
              ¿A qué número de artículo (1–169) corresponde esta escena?
            </label>
            <div class="reto-input-fila">
              <input
                type="number"
                id="input-numero-art"
                class="reto-input-numerico"
                min="1"
                max="169"
                placeholder="Introduce el n.º de artículo (ej. 4)"
                required
              />
              <button type="submit" class="btn-mesa btn-mesa-primary">
                Comprobar Artículo
              </button>
            </div>
          </form>

          <div id="reto-feedback" class="reto-feedback" aria-live="polite"></div>
        </div>
      `;

      escenarioReto.appendChild(tarjetaReto);
      contenedorMesa.appendChild(escenarioReto);

      const formulario = contenedorMesa.querySelector('#form-adivinar-articulo') as HTMLFormElement;
      const inputNumero = contenedorMesa.querySelector('#input-numero-art') as HTMLInputElement;
      const cajaFeedback = contenedorMesa.querySelector('#reto-feedback') as HTMLElement;
      const badgeDominio = contenedorMesa.querySelector('#badge-dominio-actual') as HTMLElement;

      formulario?.addEventListener('submit', (e) => {
        e.preventDefault();
        const valorUsuario = parseInt(inputNumero.value, 10);
        intentosRealizados += 1;
        tarjetaReto.classList.remove('is-correct', 'is-wrong');

        if (valorUsuario === articuloReto.id) {
          tarjetaReto.classList.add('is-correct');
          cajaFeedback.className = 'reto-feedback feedback-exito';

          if (intentosRealizados === 1) {
            const actualizados = guardarArticuloDominadoStorage(articuloReto.id);
            setDominadosIds(actualizados);
            if (badgeDominio) {
              badgeDominio.textContent = '★ ¡Dominado al 1.er intento (Guardado en localStorage)!';
            }
            cajaFeedback.innerHTML = `
              <strong>¡Acierto al primer intento! Artículo ${articuloReto.id_articulo} marcado como DOMINADO en localStorage.</strong><br/>
              Palabra Casillero: <strong>${articuloReto.palabra_casillero}</strong> · Tema General: <em>${articuloReto.tema_general}</em>
            `;
          } else {
            cajaFeedback.innerHTML = `
              <strong>¡Correcto! Es el Artículo ${articuloReto.id_articulo}</strong> (acertado en el intento n.º ${intentosRealizados}).<br/>
              <em>Nota: Solo se marca como dominado si se acierta al primer intento sin pistas.</em><br/>
              Palabra Casillero: <strong>${articuloReto.palabra_casillero}</strong> · Tema General: <em>${articuloReto.tema_general}</em>
            `;
          }
        } else {
          const actualizadosFallos = registrarFalloArticuloStorage(articuloReto.id);
          setFallosIds(actualizadosFallos.fallosIds);
          setMapaFallos({ ...actualizadosFallos.mapaFallos });
          tarjetaReto.classList.add('is-wrong');
          cajaFeedback.className = 'reto-feedback feedback-error';
          cajaFeedback.innerHTML = `
            <strong>Incorrecto (Intento n.º ${intentosRealizados}).</strong> Artículo añadido a «Artículos con fallos». Pista del Sistema Mayor: la palabra casillero de esta escena es
            <strong>«${articuloReto.palabra_casillero}»</strong>. ¡Convierte sus consonantes en números e inténtalo de nuevo!
          `;
        }
      });

      contenedorMesa.querySelector('#btn-nuevo-reto')?.addEventListener('click', () => {
        limpiarMesaDeTrabajo();
        const actualizadoMazo = obtenerMazoFiltrado();
        if (actualizadoMazo.length === 0) {
          renderizarEstadoVacioFiltro();
        } else {
          iniciarModoRetoCasillero(actualizadoMazo);
        }
      });
    }

    function iniciarModoLluviaConceptos(mazo: ArticuloCE[]) {
      if (!contenedorMesa) return;
      const cantidadParejas = Math.min(5, mazo.length);
      const cincoArticulos = barajarArray(mazo).slice(0, cantidadParejas);
      const tarjetasNumeros = [...cincoArticulos];
      const tarjetasConceptos = barajarArray(cincoArticulos);

      const hud = document.createElement('section');
      hud.className = 'tablero-hud';
      hud.innerHTML = `
        <div class="hud-metrics">
          <span>ConstituSol · Modo 3: Lluvia de Conceptos (${cantidadParejas} Artículos)</span>
          <span class="hud-separator">·</span>
          <span id="contador-parejas">Parejas resueltas: 0 / ${cantidadParejas}</span>
        </div>
        <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-nueva-lluvia">
          Repartir Nuevos →
        </button>
      `;
      contenedorMesa.appendChild(hud);

      const tableroMatching = document.createElement('section');
      tableroMatching.className = 'matching-board';

      const colNumeros = document.createElement('div');
      colNumeros.className = 'matching-column';
      colNumeros.innerHTML = `<h3 class="matching-col-title">1. Haz clic en un Número de Artículo (${cantidadParejas})</h3>`;

      const colConceptos = document.createElement('div');
      colConceptos.className = 'matching-column';
      colConceptos.innerHTML = `<h3 class="matching-col-title">2. Haz clic en su Tema General (${cantidadParejas})</h3>`;

      tarjetasNumeros.forEach((art) => {
        const btnNum = document.createElement('button');
        btnNum.type = 'button';
        btnNum.className = 'matching-card matching-card-num';
        btnNum.setAttribute('data-num-id', String(art.id));
        btnNum.innerHTML = `
          <span class="matching-badge">Artículo ${art.id_articulo}</span>
          <span class="matching-subhint">Casillero: ${art.palabra_casillero}</span>
        `;

        btnNum.addEventListener('click', () => {
          if (btnNum.classList.contains('is-matched')) return;
          colNumeros
            .querySelectorAll('.matching-card-num')
            .forEach((el) => el.classList.remove('is-selected'));
          seleccionNumeroId = art.id;
          btnNum.classList.add('is-selected');
          verificarEmparejamiento(colNumeros, colConceptos, cantidadParejas);
        });

        colNumeros.appendChild(btnNum);
      });

      tarjetasConceptos.forEach((art) => {
        const btnCon = document.createElement('button');
        btnCon.type = 'button';
        btnCon.className = 'matching-card matching-card-concept';
        btnCon.setAttribute('data-concept-id', String(art.id));
        btnCon.innerHTML = `<span class="matching-concept-text">${art.tema_general}</span>`;

        btnCon.addEventListener('click', () => {
          if (btnCon.classList.contains('is-matched')) return;
          colConceptos
            .querySelectorAll('.matching-card-concept')
            .forEach((el) => el.classList.remove('is-selected'));
          seleccionConceptoId = art.id;
          btnCon.classList.add('is-selected');
          verificarEmparejamiento(colNumeros, colConceptos, cantidadParejas);
        });

        colConceptos.appendChild(btnCon);
      });

      tableroMatching.appendChild(colNumeros);
      tableroMatching.appendChild(colConceptos);
      contenedorMesa.appendChild(tableroMatching);

      const bannerVictoria = document.createElement('div');
      bannerVictoria.id = 'matching-victoria';
      bannerVictoria.className = 'matching-victoria is-hidden';
      bannerVictoria.innerHTML = `
        <strong>¡Ronda completada en ConstituSol!</strong> Has emparejado correctamente todos los artículos con sus temas generales.
      `;
      contenedorMesa.appendChild(bannerVictoria);

      contenedorMesa.querySelector('#btn-nueva-lluvia')?.addEventListener('click', () => {
        limpiarMesaDeTrabajo();
        const actualizadoMazo = obtenerMazoFiltrado();
        if (actualizadoMazo.length === 0) {
          renderizarEstadoVacioFiltro();
        } else {
          iniciarModoLluviaConceptos(actualizadoMazo);
        }
      });
    }

    function verificarEmparejamiento(
      colNumeros: HTMLElement,
      colConceptos: HTMLElement,
      metaParejas: number
    ) {
      if (seleccionNumeroId === null || seleccionConceptoId === null) return;

      const cardNum = colNumeros.querySelector(
        `[data-num-id="${seleccionNumeroId}"]`
      ) as HTMLButtonElement | null;
      const cardCon = colConceptos.querySelector(
        `[data-concept-id="${seleccionConceptoId}"]`
      ) as HTMLButtonElement | null;
      if (!cardNum || !cardCon) return;

      if (seleccionNumeroId === seleccionConceptoId) {
        cardNum.classList.remove('is-selected');
        cardCon.classList.remove('is-selected');
        cardNum.classList.add('is-matched');
        cardCon.classList.add('is-matched');
        cardNum.disabled = true;
        cardCon.disabled = true;

        parejasResueltas += 1;
        const contador = contenedorMesa?.querySelector('#contador-parejas');
        if (contador) contador.textContent = `Parejas resueltas: ${parejasResueltas} / ${metaParejas}`;

        if (parejasResueltas === metaParejas) {
          contenedorMesa?.querySelector('#matching-victoria')?.classList.remove('is-hidden');
        }
      } else {
        cardNum.classList.add('is-error');
        cardCon.classList.add('is-error');
        setTimeout(() => {
          cardNum.classList.remove('is-selected', 'is-error');
          cardCon.classList.remove('is-selected', 'is-error');
        }, 650);
      }

      seleccionNumeroId = null;
      seleccionConceptoId = null;
    }

    function iniciarModoCazadorTrampas(mazo: ArticuloCE[]) {
      if (!contenedorMesa) return;
      const articulo = mazo[Math.floor(Math.random() * mazo.length)];
      const aciertosIniciales = leerAciertosCazadorStorage();

      const testTrampa = articulo.test_trampa;
      const opcionesConMetadatos = testTrampa.opciones.map((texto, idxOriginal) => ({
        texto,
        esCorrecta: idxOriginal === testTrampa.indice_correcta
      }));
      const opcionesMezcladas = barajarArray(opcionesConMetadatos);
      const letras = ['A', 'B', 'C', 'D'];

      const textoBoeVulnerado = articulo.apartados
        .map((ap) => `[Apartado ${ap.id_apartado}] ${ap.texto_oficial}`)
        .join('\n\n');

      const hud = document.createElement('section');
      hud.className = 'tablero-hud';
      hud.innerHTML = `
        <div class="hud-metrics">
          <span>ConstituSol · Modo 4: Cazador de Trampas</span>
          <span class="hud-separator">·</span>
          <span id="hud-aciertos-cazador">🎯 Trampas Cazadas (Aciertos): ${aciertosIniciales}</span>
        </div>
        <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-siguiente-trampa">
          Siguiente Test Trampa →
        </button>
      `;
      contenedorMesa.appendChild(hud);

      const contenedorCazador = document.createElement('section');
      contenedorCazador.className = 'cazador-contenedor';

      const imagenUrl = obtenerRutaImagenArticulo(articulo.id_articulo);

      const cardCazador = document.createElement('article');
      cardCazador.className = 'cazador-card';

      const opcionesHtml = opcionesMezcladas
        .map(
          (op, idx) => `
            <button
              type="button"
              class="cazador-opcion-btn"
              data-opcion-index="${idx}"
              data-es-correcta="${op.esCorrecta ? 'true' : 'false'}"
            >
              <span class="cazador-opcion-letra">${letras[idx]}</span>
              <span class="cazador-opcion-contenido">
                <span class="cazador-opcion-texto">${op.texto}</span>
                <span class="cazador-opcion-tag is-hidden"></span>
              </span>
            </button>
          `
        )
        .join('');

      cardCazador.innerHTML = `
        <header class="cazador-header">
          <div class="cazador-header-top">
            <span class="cazador-art-badge">🎯 Artículo ${articulo.id_articulo} CE</span>
            <span class="cazador-aciertos-pill" id="pill-aciertos-cazador">
              ✓ Aciertos acumulados: ${aciertosIniciales}
            </span>
          </div>

          <div class="cazador-title-row">
            <h2 class="cazador-tema-titulo">${articulo.tema_general}</h2>
            <button
              type="button"
              class="btn-anclaje-mental"
              id="btn-toggle-anclaje"
              aria-expanded="false"
            >
              🧠 Ver anclaje mental
            </button>
          </div>
        </header>

        <!-- Pista Mnemotécnica Desplegable ("Ver anclaje mental") -->
        <section id="panel-anclaje-mental" class="cazador-anclaje-panel is-hidden" aria-label="Pista mnemotécnica del casillero mental">
          <div class="cazador-anclaje-media">
            <img
              src="${imagenUrl}"
              alt="Anclaje mental de ${articulo.palabra_casillero}"
              class="cazador-anclaje-img"
              loading="lazy"
              onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.classList.remove('is-hidden');"
            />
            <div class="img-fallback-box is-hidden" aria-label="Cuadro de sustitución de anclaje mental">
              <span class="img-fallback-badge">🎨 Casillero: ${articulo.palabra_casillero}</span>
              <span class="img-fallback-title">Artículo ${articulo.id_articulo} · ${articulo.tema_general}</span>
              <span class="img-fallback-sub">./assets/images/art_${articulo.id_articulo}.jpg · Escena en preparación</span>
            </div>
          </div>
          <div class="cazador-anclaje-body">
            <span class="cazador-anclaje-peg">
              🔑 Palabra del Casillero (${articulo.id_articulo}): ${articulo.palabra_casillero}
            </span>
            <p class="cazador-anclaje-historia">
              <strong>Escena Mnemotécnica:</strong> ${articulo.historia_mnemotecnica}
            </p>
          </div>
        </section>

        <!-- Enunciado de la pregunta trampa -->
        <div class="cazador-enunciado-box">
          <span class="cazador-enunciado-label">Pregunta Oficial de Examen · Detalle Susceptible de Trampa</span>
          <p class="cazador-enunciado-texto">${testTrampa.enunciado}</p>
        </div>

        <!-- 4 Opciones mezcladas aleatoriamente -->
        <div class="cazador-opciones-lista" role="group" aria-label="Opciones de respuesta">
          ${opcionesHtml}
        </div>

        <!-- Caja de Alerta Destacada (Explicación de la trampa + BOE vulnerado) -->
        <div id="cazador-alerta-box" class="cazador-alerta-trampa is-hidden" aria-live="polite"></div>
      `;

      contenedorCazador.appendChild(cardCazador);
      contenedorMesa.appendChild(contenedorCazador);

      const btnAnclaje = cardCazador.querySelector('#btn-toggle-anclaje') as HTMLButtonElement | null;
      const panelAnclaje = cardCazador.querySelector('#panel-anclaje-mental') as HTMLElement | null;

      btnAnclaje?.addEventListener('click', () => {
        if (!panelAnclaje) return;
        const oculto = panelAnclaje.classList.contains('is-hidden');
        if (oculto) {
          panelAnclaje.classList.remove('is-hidden');
          btnAnclaje.classList.add('is-open');
          btnAnclaje.setAttribute('aria-expanded', 'true');
          btnAnclaje.textContent = '🧠 Ocultar anclaje mental';
        } else {
          panelAnclaje.classList.add('is-hidden');
          btnAnclaje.classList.remove('is-open');
          btnAnclaje.setAttribute('aria-expanded', 'false');
          btnAnclaje.textContent = '🧠 Ver anclaje mental';
        }
      });

      const botonesOpcion = cardCazador.querySelectorAll('.cazador-opcion-btn') as NodeListOf<HTMLButtonElement>;
      const cajaAlerta = cardCazador.querySelector('#cazador-alerta-box') as HTMLElement | null;
      const pillAciertos = cardCazador.querySelector('#pill-aciertos-cazador') as HTMLElement | null;
      const hudAciertos = contenedorMesa.querySelector('#hud-aciertos-cazador') as HTMLElement | null;

      botonesOpcion.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          const esCorrecta = btn.getAttribute('data-es-correcta') === 'true';

          botonesOpcion.forEach((b) => {
            b.disabled = true;
          });

          if (esCorrecta) {
            btn.classList.add('is-correct');
            cardCazador.classList.add('is-correct-card');
            const tag = btn.querySelector('.cazador-opcion-tag');
            if (tag) {
              tag.classList.remove('is-hidden');
              tag.textContent = '✓ ¡Opción Correcta Literal!';
            }

            const nuevoTotal = incrementarAciertosCazadorStorage();
            if (pillAciertos) pillAciertos.textContent = `✓ Aciertos acumulados: ${nuevoTotal}`;
            if (hudAciertos) hudAciertos.textContent = `🎯 Trampas Cazadas (Aciertos): ${nuevoTotal}`;

            if (cajaAlerta) {
              cajaAlerta.className = 'cazador-alerta-trampa alerta-exito';
              cajaAlerta.innerHTML = `
                <div class="cazador-alerta-titulo">
                  <span>✅</span>
                  <span>¡Trampa Cazada! Has identificado el precepto exacto del Artículo ${articulo.id_articulo}</span>
                </div>
                <p class="cazador-alerta-explicacion">
                  <strong>Claves del tribunal:</strong> ${testTrampa.trampa_explicacion}
                </p>
                <div class="cazador-boe-vulnerado">
                  <span class="cazador-boe-vulnerado-label">📜 Texto Oficial Consolidado del BOE (Artículo ${articulo.id_articulo})</span>
                  <p class="cazador-boe-vulnerado-texto">${textoBoeVulnerado}</p>
                </div>
              `;
            }
          } else {
            const actualizadosFallos = registrarFalloArticuloStorage(articulo.id);
            setFallosIds(actualizadosFallos.fallosIds);
            setMapaFallos({ ...actualizadosFallos.mapaFallos });
            btn.classList.add('is-wrong');
            cardCazador.classList.add('is-wrong-card');
            const tagError = btn.querySelector('.cazador-opcion-tag');
            if (tagError) {
              tagError.classList.remove('is-hidden');
              tagError.textContent = '✗ Opción con Trampa (Incorrecta)';
            }

            botonesOpcion.forEach((b) => {
              if (b.getAttribute('data-es-correcta') === 'true') {
                b.classList.add('is-correct');
                const tagOk = b.querySelector('.cazador-opcion-tag');
                if (tagOk) {
                  tagOk.classList.remove('is-hidden');
                  tagOk.textContent = '✓ Opción Correcta (Literal BOE)';
                }
              }
            });

            if (cajaAlerta) {
              cajaAlerta.className = 'cazador-alerta-trampa alerta-error';
              cajaAlerta.innerHTML = `
                <div class="cazador-alerta-titulo">
                  <span>⚠️</span>
                  <span>¡Alerta de Trampa de Examen en el Artículo ${articulo.id_articulo}!</span>
                </div>
                <p class="cazador-alerta-explicacion">
                  <strong>¿Dónde estaba la trampa?:</strong> ${testTrampa.trampa_explicacion}
                </p>
                <div class="cazador-boe-vulnerado">
                  <span class="cazador-boe-vulnerado-label">📜 Fragmento del Texto Oficial del BOE Vulnerado (Artículo ${articulo.id_articulo})</span>
                  <p class="cazador-boe-vulnerado-texto">${textoBoeVulnerado}</p>
                </div>
              `;
            }
          }
        });
      });

      contenedorMesa.querySelector('#btn-siguiente-trampa')?.addEventListener('click', () => {
        limpiarMesaDeTrabajo();
        const actualizadoMazo = obtenerMazoFiltrado();
        if (actualizadoMazo.length === 0) {
          renderizarEstadoVacioFiltro();
        } else {
          iniciarModoCazadorTrampas(actualizadoMazo);
        }
      });
    }

    function abrirModalRapidoArticulo(articulo: ArticuloCE) {
      const estadoActual = obtenerEstadoArticuloStorage(articulo.id);
      const imagenUrl = obtenerRutaImagenArticulo(articulo.id_articulo);

      const overlay = document.createElement('div');
      overlay.className = 'mapa-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      const apartadosHtml = articulo.apartados
        .map(
          (ap) => `
            <div class="reto-boe-apartado-item">
              <div class="reto-boe-apartado-head">
                <span class="reto-boe-apartado-num">Apartado ${ap.id_apartado}</span>
                <span class="reto-boe-apartado-resumen">— ${ap.concepto_clave}</span>
              </div>
              <p class="reto-boe-apartado-texto">${ap.texto_oficial}</p>
            </div>
          `
        )
        .join('');

      overlay.innerHTML = `
        <div class="mapa-modal-card">
          <header class="mapa-modal-header">
            <div class="mapa-modal-title-group">
              <span class="mapa-modal-badge">ConstituSol · Artículo ${articulo.id_articulo} CE · Casillero: ${articulo.palabra_casillero}</span>
              <h3 class="mapa-modal-title">${articulo.tema_general}</h3>
            </div>
            <button type="button" class="btn-cerrar-modal" id="btn-cerrar-mapa-modal">✕ Cerrar</button>
          </header>

          <div class="mapa-modal-body">
            <div class="mapa-modal-status-bar">
              <span class="mapa-modal-status-label">Estado en localStorage:</span>
              <div class="mapa-modal-status-btns">
                <button type="button" class="btn-status-choice ${estadoActual === 'dominado' ? 'active-verde' : ''}" data-set-status="dominado">
                  🟢 Dominado
                </button>
                <button type="button" class="btn-status-choice ${estadoActual === 'repaso' ? 'active-amarillo' : ''}" data-set-status="repaso">
                  🟡 En repaso
                </button>
                <button type="button" class="btn-status-choice ${estadoActual === 'no_estudiado' ? 'active-gris' : ''}" data-set-status="no_estudiado">
                  ⚪ No estudiado
                </button>
              </div>
            </div>

            <div class="cazador-anclaje-panel">
              <div class="cazador-anclaje-media">
                <img
                  src="${imagenUrl}"
                  alt="Escena mnemotécnica de ${articulo.palabra_casillero}"
                  class="cazador-anclaje-img"
                  loading="lazy"
                  onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.classList.remove('is-hidden');"
                />
                <div class="img-fallback-box is-hidden" aria-label="Cuadro de sustitución de escena mnemotécnica">
                  <span class="img-fallback-badge">🎨 Casillero: ${articulo.palabra_casillero}</span>
                  <span class="img-fallback-title">Artículo ${articulo.id_articulo} · ${articulo.tema_general}</span>
                  <span class="img-fallback-sub">./assets/images/art_${articulo.id_articulo}.jpg · Escena en preparación</span>
                </div>
              </div>
              <div class="cazador-anclaje-body">
                <span class="cazador-anclaje-peg">🔑 Palabra del Casillero (${articulo.id_articulo}): ${articulo.palabra_casillero}</span>
                <p class="cazador-anclaje-historia"><strong>Historia Mnemotécnica:</strong> ${articulo.historia_mnemotecnica}</p>
              </div>
            </div>

            <section class="reto-boe-container">
              <div class="reto-boe-header">
                <h4 class="reto-boe-title">📜 Texto Íntegro Oficial del BOE (Artículo ${articulo.id_articulo})</h4>
                <span class="reto-boe-badge">${articulo.apartados.length} apartado(s)</span>
              </div>
              <div class="reto-boe-apartados-list">
                ${apartadosHtml}
              </div>
            </section>
          </div>

          <footer class="mapa-modal-footer">
            <button type="button" class="btn-mesa btn-sm" id="btn-modal-cerrar-sec">Volver al Mapa</button>
            <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-abrir-en-descubrimiento">
              🃏 Abrir Tarjeta en Modo Descubrimiento →
            </button>
          </footer>
        </div>
      `;

      document.body.appendChild(overlay);

      const cerrarYRefrescar = () => {
        overlay.remove();
        limpiarMesaDeTrabajo();
        iniciarModoMapaConstitucional();
      };

      overlay.querySelector('#btn-cerrar-mapa-modal')?.addEventListener('click', cerrarYRefrescar);
      overlay.querySelector('#btn-modal-cerrar-sec')?.addEventListener('click', cerrarYRefrescar);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarYRefrescar();
      });

      overlay.querySelectorAll('[data-set-status]').forEach((btnChoice) => {
        btnChoice.addEventListener('click', () => {
          const nuevoEst = btnChoice.getAttribute('data-set-status') as 'dominado' | 'repaso' | 'no_estudiado';
          const nuevosDominados = establecerEstadoArticuloStorage(articulo.id, nuevoEst);
          setDominadosIds(nuevosDominados);

          overlay.querySelectorAll('[data-set-status]').forEach((b) => {
            b.classList.remove('active-verde', 'active-amarillo', 'active-gris');
          });
          if (nuevoEst === 'dominado') btnChoice.classList.add('active-verde');
          else if (nuevoEst === 'repaso') btnChoice.classList.add('active-amarillo');
          else btnChoice.classList.add('active-gris');
        });
      });

      overlay.querySelector('#btn-abrir-en-descubrimiento')?.addEventListener('click', () => {
        overlay.remove();
        indiceDescubrimientoRef.current = Math.max(0, articulo.id - 1);
        setFiltroDominio('todos');
        setModoActual('modo1');
      });
    }

    function abrirModalRapidoEspecial(itemEsp: ItemEspecialMapaCE) {
      const overlay = document.createElement('div');
      overlay.className = 'mapa-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      overlay.innerHTML = `
        <div class="mapa-modal-card">
          <header class="mapa-modal-header">
            <div class="mapa-modal-title-group">
              <span class="mapa-modal-badge">ConstituSol · ${itemEsp.codigo} · Casillero: ${itemEsp.palabra_casillero}</span>
              <h3 class="mapa-modal-title">${itemEsp.titulo}</h3>
            </div>
            <button type="button" class="btn-cerrar-modal" id="btn-cerrar-esp-modal">✕ Cerrar</button>
          </header>

          <div class="mapa-modal-body">
            <div class="cazador-anclaje-panel">
              <div class="cazador-anclaje-body">
                <span class="cazador-anclaje-peg">🔑 Anclaje Mnemotécnico: ${itemEsp.palabra_casillero}</span>
                <p class="cazador-anclaje-historia"><strong>Escena Mnemotécnica:</strong> ${itemEsp.historia_mnemotecnica}</p>
              </div>
            </div>

            <section class="reto-boe-container">
              <div class="reto-boe-header">
                <h4 class="reto-boe-title">📜 Texto Oficial Consolidado del BOE (${itemEsp.codigo})</h4>
                <span class="reto-boe-badge">${itemEsp.concepto_clave}</span>
              </div>
              <div class="reto-boe-apartado-item">
                <p class="reto-boe-apartado-texto">${itemEsp.texto_oficial}</p>
              </div>
            </section>
          </div>

          <footer class="mapa-modal-footer">
            <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-cerrar-esp-footer">
              Volver al Mapa Constitucional
            </button>
          </footer>
        </div>
      `;

      document.body.appendChild(overlay);
      const cerrar = () => overlay.remove();
      overlay.querySelector('#btn-cerrar-esp-modal')?.addEventListener('click', cerrar);
      overlay.querySelector('#btn-cerrar-esp-footer')?.addEventListener('click', cerrar);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrar();
      });
    }

    function iniciarModoMapaConstitucional() {
      if (!contenedorMesa) return;
      const db = window.constitucion_db || constitucion_db;
      const mapaPorId = new Map<number, ArticuloCE>();
      db.forEach((art) => mapaPorId.set(art.id, art));

      const setDom = new Set(leerArticulosDominadosStorage());
      const setRep = new Set(leerArticulosEnRepasoStorage());

      let totalVerde = 0;
      let totalAmarillo = 0;
      let totalGris = 0;

      for (let i = 1; i <= 169; i++) {
        if (setDom.has(i)) totalVerde++;
        else if (setRep.has(i)) totalAmarillo++;
        else totalGris++;
      }

      const wrapperMapa = document.createElement('section');
      wrapperMapa.className = 'mapa-contenedor';

      const resumenBar = document.createElement('div');
      resumenBar.className = 'mapa-resumen-bar';
      resumenBar.innerHTML = `
        <div class="mapa-resumen-top">
          <div>
            <h2 class="mapa-resumen-titulo">🗺️ Mapa Constitucional de España (Índice Estructural y Casillero)</h2>
            <p class="hud-metrics">Despliega cualquier bloque o Título y haz clic en una minitarjeta para ver su mnemotecnia, el BOE íntegro o abrirla en Modo Descubrimiento.</p>
          </div>
          <div class="mapa-controles-acordeon">
            <button type="button" class="btn-mesa btn-sm" id="btn-expandir-todos-titulos">Expandir Todos</button>
            <button type="button" class="btn-mesa btn-sm" id="btn-contraer-todos-titulos">Contraer Todos</button>
          </div>
        </div>
        <div class="mapa-leyenda-estados">
          <span class="mapa-leyenda-item">
            <span class="mapa-dot dot-verde"></span>
            <span>Dominado (${totalVerde})</span>
          </span>
          <span class="mapa-leyenda-item">
            <span class="mapa-dot dot-amarillo"></span>
            <span>En repaso (${totalAmarillo})</span>
          </span>
          <span class="mapa-leyenda-item">
            <span class="mapa-dot dot-gris"></span>
            <span>No estudiado (${totalGris})</span>
          </span>
        </div>
      `;
      wrapperMapa.appendChild(resumenBar);

      const listaAcordeones = document.createElement('div');
      listaAcordeones.className = 'mapa-acordeones-lista';

      ESTRUCTURA_MAPA_CE.forEach((bloque) => {
        const estaAbierto = bloquesAbiertosRef.current.has(bloque.id_bloque);
        const itemAcordeon = document.createElement('article');
        itemAcordeon.className = `mapa-acordeon-item ${estaAbierto ? 'is-open' : ''}`;

        let v = 0;
        let a = 0;
        let g = 0;

        if (bloque.rango_articulos) {
          const [ini, fin] = bloque.rango_articulos;
          for (let num = ini; num <= fin; num++) {
            if (setDom.has(num)) v++;
            else if (setRep.has(num)) a++;
            else g++;
          }
        }

        const btnTrigger = document.createElement('button');
        btnTrigger.type = 'button';
        btnTrigger.className = 'mapa-acordeon-trigger';
        btnTrigger.setAttribute('aria-expanded', estaAbierto ? 'true' : 'false');

        btnTrigger.innerHTML = `
          <div class="mapa-acordeon-head-left">
            <span class="mapa-acordeon-sigla">${bloque.sigla}</span>
            <h3 class="mapa-acordeon-denominacion">${bloque.denominacion_oficial}</h3>
            <p class="mapa-acordeon-subcapitulos">${bloque.subestructura_resumen}</p>
          </div>
          <div class="mapa-acordeon-head-right">
            <span class="mapa-acordeon-rango">${bloque.rango_etiqueta}</span>
            ${
              bloque.rango_articulos
                ? `
              <div class="mapa-acordeon-stats" title="Dominados / En repaso / No estudiados">
                <span class="mapa-stat-pill stat-verde">🟢 ${v}</span>
                <span class="mapa-stat-pill stat-amarillo">🟡 ${a}</span>
                <span class="mapa-stat-pill stat-gris">⚪ ${g}</span>
              </div>
            `
                : ''
            }
            <span class="mapa-acordeon-chevron">▼</span>
          </div>
        `;

        const bodyAcordeon = document.createElement('div');
        bodyAcordeon.className = `mapa-acordeon-body ${estaAbierto ? '' : 'is-hidden'}`;

        const gridMinicards = document.createElement('div');
        gridMinicards.className = 'mapa-minicards-grid';

        if (bloque.rango_articulos) {
          const [ini, fin] = bloque.rango_articulos;
          for (let num = ini; num <= fin; num++) {
            const art = mapaPorId.get(num);
            if (!art) continue;

            const estado = obtenerEstadoArticuloStorage(num);
            const claseEstado =
              estado === 'dominado'
                ? 'status-dominado'
                : estado === 'repaso'
                ? 'status-repaso'
                : 'status-no-estudiado';
            const dotClase =
              estado === 'dominado'
                ? 'dot-verde'
                : estado === 'repaso'
                ? 'dot-amarillo'
                : 'dot-gris';

            const minicard = document.createElement('button');
            minicard.type = 'button';
            minicard.className = `mapa-minicard ${claseEstado}`;
            minicard.innerHTML = `
              <div class="mapa-minicard-top">
                <span class="mapa-minicard-num">Art. ${num}</span>
                <span class="mapa-dot ${dotClase}"></span>
              </div>
              <div class="mapa-minicard-peg">🔑 ${art.palabra_casillero}</div>
              <div class="mapa-minicard-tema">${art.tema_general}</div>
            `;

            minicard.addEventListener('click', () => {
              if (obtenerEstadoArticuloStorage(num) === 'no_estudiado') {
                marcarArticuloEnRepasoStorage(num);
              }
              abrirModalRapidoArticulo(art);
            });

            gridMinicards.appendChild(minicard);
          }
        } else if (bloque.items_especiales) {
          bloque.items_especiales.forEach((itemEsp) => {
            const minicard = document.createElement('button');
            minicard.type = 'button';
            minicard.className = 'mapa-minicard status-repaso';
            minicard.innerHTML = `
              <div class="mapa-minicard-top">
                <span class="mapa-minicard-num">${itemEsp.codigo}</span>
                <span class="mapa-dot dot-amarillo"></span>
              </div>
              <div class="mapa-minicard-peg">🔑 ${itemEsp.palabra_casillero}</div>
              <div class="mapa-minicard-tema">${itemEsp.concepto_clave}</div>
            `;

            minicard.addEventListener('click', () => {
              abrirModalRapidoEspecial(itemEsp);
            });

            gridMinicards.appendChild(minicard);
          });
        }

        bodyAcordeon.appendChild(gridMinicards);
        itemAcordeon.appendChild(btnTrigger);
        itemAcordeon.appendChild(bodyAcordeon);
        listaAcordeones.appendChild(itemAcordeon);

        btnTrigger.addEventListener('click', () => {
          const abierto = itemAcordeon.classList.contains('is-open');
          if (abierto) {
            itemAcordeon.classList.remove('is-open');
            bodyAcordeon.classList.add('is-hidden');
            btnTrigger.setAttribute('aria-expanded', 'false');
            bloquesAbiertosRef.current.delete(bloque.id_bloque);
          } else {
            itemAcordeon.classList.add('is-open');
            bodyAcordeon.classList.remove('is-hidden');
            btnTrigger.setAttribute('aria-expanded', 'true');
            bloquesAbiertosRef.current.add(bloque.id_bloque);
          }
        });
      });

      wrapperMapa.appendChild(listaAcordeones);
      contenedorMesa.appendChild(wrapperMapa);

      contenedorMesa.querySelector('#btn-expandir-todos-titulos')?.addEventListener('click', () => {
        ESTRUCTURA_MAPA_CE.forEach((b) => bloquesAbiertosRef.current.add(b.id_bloque));
        limpiarMesaDeTrabajo();
        iniciarModoMapaConstitucional();
      });

      contenedorMesa.querySelector('#btn-contraer-todos-titulos')?.addEventListener('click', () => {
        bloquesAbiertosRef.current.clear();
        limpiarMesaDeTrabajo();
        iniciarModoMapaConstitucional();
      });
    }

    limpiarMesaDeTrabajo();
    if (modoActual === 'mapa') {
      iniciarModoMapaConstitucional();
      return;
    }

    const mazoFiltrado = obtenerMazoFiltrado();
    if (mazoFiltrado.length === 0) {
      renderizarEstadoVacioFiltro();
      return;
    }

    if (modoActual === 'modo1') {
      iniciarModoDescubrimiento(mazoFiltrado);
    } else if (modoActual === 'modo2') {
      iniciarModoRetoCasillero(mazoFiltrado);
    } else if (modoActual === 'modo3') {
      iniciarModoLluviaConceptos(mazoFiltrado);
    } else if (modoActual === 'modo4') {
      iniciarModoCazadorTrampas(mazoFiltrado);
    }
  }, [activeView, modoActual, filtroDominio]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDownloadPureJson = () => {
    const a = document.createElement('a');
    a.href = '/constitucion_apartados.json';
    a.download = 'constitucion_apartados.json';
    a.click();
  };

  const handleDownloadDatosCe = () => {
    const a = document.createElement('a');
    a.href = '/datos_ce.js';
    a.download = 'datos_ce.js';
    a.click();
  };

  const handleDownloadJs = () => {
    const a = document.createElement('a');
    a.href = '/app_mnemotecnia.js';
    a.download = 'app_mnemotecnia.js';
    a.click();
  };

  const handleDownloadSpaHtml = () => {
    const a = document.createElement('a');
    a.href = '/simulador_mesa.html';
    a.download = 'simulador_mesa.html';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col overflow-x-hidden">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 md:gap-8 px-3.5 sm:px-6 py-3 bg-[#0b291d] text-white border-b border-amber-500/30">
        {/* Zone 1: Single text element wordmark ("ConstituSol") */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('mesa');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
        >
          ConstituSol
        </a>

        {/* Zone 2: 3 concise single-line navigation links (touch-friendly >= 44px) */}
        <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveView('mesa')}
            className={`min-h-[44px] px-2.5 sm:px-1 inline-flex items-center hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'mesa' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Mesa de Trabajo
          </button>
          <button
            onClick={() => setActiveView('vanilla_js')}
            className={`min-h-[44px] px-2.5 sm:px-1 inline-flex items-center hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'vanilla_js' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Código ConstituSol
          </button>
          <button
            onClick={() => setActiveView('datos_ce')}
            className={`min-h-[44px] px-2.5 sm:px-1 inline-flex items-center hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'datos_ce' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            JSON Puro (Apartados)
          </button>
        </nav>

        {/* Zone 3: 1 primary action (touch-friendly >= 44px) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadSpaHtml}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar ConstituSol
          </button>
        </div>
      </header>

      {/* VIEW 1: MESA DE TRABAJO CONSTITUSOL */}
      {activeView === 'mesa' && (
        <div className="mesa-board-wrapper">
          <div className="mesa-subbar">
            <div className="mesa-subbar-inner">
              <div className="mode-selector-group" aria-label="Modos de Aprendizaje y Filtro de Dominio">
                {/* Selector de los 4 Modos */}
                <div className="mode-buttons" role="tablist">
                  <button
                    type="button"
                    onClick={() => setModoActual('modo1')}
                    className={`mode-btn ${modoActual === 'modo1' ? 'is-active' : ''}`}
                  >
                    Modo 1: Descubrimiento
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoActual('modo2')}
                    className={`mode-btn ${modoActual === 'modo2' ? 'is-active' : ''}`}
                  >
                    Modo 2: El Reto del Casillero
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoActual('modo3')}
                    className={`mode-btn ${modoActual === 'modo3' ? 'is-active' : ''}`}
                  >
                    Modo 3: Lluvia de Conceptos
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoActual('modo4')}
                    className={`mode-btn ${modoActual === 'modo4' ? 'is-active' : ''}`}
                  >
                    Modo 4: Cazador de Trampas
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoActual('mapa')}
                    className={`mode-btn ${modoActual === 'mapa' ? 'is-active' : ''}`}
                  >
                    🗺️ Mapa Constitucional
                  </button>
                </div>

                {/* Contador de Artículos Dominados + Filtro de Dominio */}
                <div className="progreso-toolbar">
                  <span id="contador-dominados" className="contador-dominados-text">
                    Artículos Dominados: {dominadosIds.length} / {constitucion_db.length}
                  </span>

                  <select
                    id="filtro-dominio"
                    value={filtroDominio}
                    onChange={(e) => {
                      indiceDescubrimientoRef.current = 0;
                      setFiltroDominio(
                        e.target.value as 'todos' | 'no_dominados' | 'dominados' | 'con_fallos'
                      );
                    }}
                    className="mode-select-dropdown"
                    aria-label="Filtrar repaso por dominio"
                  >
                    <option value="todos">Todos los artículos (169)</option>
                    <option value="no_dominados">
                      Solo los no dominados ({constitucion_db.length - dominadosIds.length})
                    </option>
                    <option value="dominados">
                      Solo los dominados ({dominadosIds.length})
                    </option>
                    <option value="con_fallos">
                      ⚠️ Solo artículos con fallos ({fallosIds.length})
                    </option>
                  </select>

                  {(dominadosIds.length > 0 || fallosIds.length > 0) && (
                    <button
                      type="button"
                      onClick={handleResetDominados}
                      className="btn-mesa btn-sm flex items-center gap-1"
                      title="Borrar progreso guardado en localStorage"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reiniciar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DE ESTADÍSTICAS Y GAMIFICACIÓN (STREAK SYSTEM + 4 TARJETAS KPI + BARRA DE PROGRESO + FILTRO RÁPIDO) */}
          <section className="gamificacion-dashboard" aria-label="Panel de Estadísticas y Racha de Estudio">
            <div className="gamificacion-panel-inner">
              <div className="gamificacion-top-bar">
                <div className="gamificacion-title-group">
                  <h2 className="gamificacion-title">📊 Panel de Rendimiento y Motivación · ConstituSol</h2>
                  <span className="gamificacion-subtitle-pill">Persistencia LocalStorage Activa</span>
                </div>
                <div className="gamificacion-actions">
                  <button
                    type="button"
                    onClick={() => {
                      indiceDescubrimientoRef.current = 0;
                      if (filtroDominio === 'con_fallos') {
                        setFiltroDominio('todos');
                      } else {
                        if (modoActual === 'mapa') {
                          setModoActual('modo2');
                        }
                        setFiltroDominio('con_fallos');
                      }
                    }}
                    className={`btn-repasar-fallos ${filtroDominio === 'con_fallos' ? 'is-active-filter' : ''}`}
                  >
                    <span>
                      ⚠️{' '}
                      {filtroDominio === 'con_fallos'
                        ? 'Viendo solo artículos con fallos (Ver todos)'
                        : 'Repasar solo artículos con fallos'}
                    </span>
                    <span className="btn-repasar-fallos-count">{fallosIds.length}</span>
                  </button>
                </div>
              </div>

              <div className="gamificacion-kpi-grid">
                {/* Tarjeta 1: Racha Activa */}
                <article className="gamificacion-kpi-card kpi-racha">
                  <div className="gamificacion-kpi-label">
                    <span>🔥 Racha Activa</span>
                    <span>Récord: {rachaInfo.mejor_racha}d</span>
                  </div>
                  <div className="gamificacion-kpi-value">
                    {rachaInfo.racha_actual === 1
                      ? '1 día seguido'
                      : `${rachaInfo.racha_actual} días seguidos`}
                  </div>
                  <div className="gamificacion-kpi-sub">
                    Último acceso: {rachaInfo.ultimo_acceso}
                  </div>
                </article>

                {/* Tarjeta 2: Porcentaje Global Completado */}
                <article className="gamificacion-kpi-card kpi-porcentaje">
                  <div className="gamificacion-kpi-label">
                    <span>🎯 Porcentaje Global</span>
                    <span>Meta: 100%</span>
                  </div>
                  <div className="gamificacion-kpi-value">
                    {((dominadosIds.length / constitucion_db.length) * 100).toFixed(1)}%
                  </div>
                  <div className="gamificacion-kpi-sub">
                    Calculado sobre los {constitucion_db.length} artículos de la CE
                  </div>
                </article>

                {/* Tarjeta 3: Artículos Dominados vs. Pendientes */}
                <article className="gamificacion-kpi-card kpi-balance">
                  <div className="gamificacion-kpi-label">
                    <span>✅ Dominados vs. ⏳ Pendientes</span>
                  </div>
                  <div className="gamificacion-kpi-value">
                    {dominadosIds.length}{' '}
                    <span className="text-sm text-slate-400 font-normal">vs.</span>{' '}
                    {constitucion_db.length - dominadosIds.length}
                  </div>
                  <div className="gamificacion-kpi-sub">
                    ✅ {dominadosIds.length} dominados · ⏳ {constitucion_db.length - dominadosIds.length} pendientes
                  </div>
                </article>

                {/* Tarjeta 4: Artículos con Fallos Frecuentes */}
                <article className="gamificacion-kpi-card kpi-fallos">
                  <div className="gamificacion-kpi-label">
                    <span>⚠️ Artículos con Fallos</span>
                    <span>Modo 2 y 4</span>
                  </div>
                  <div className="gamificacion-kpi-value">{fallosIds.length} arts.</div>
                  <div className="gamificacion-kpi-sub">
                    {fallosIds.length > 0
                      ? `Más fallados: ${[...fallosIds]
                          .sort((a, b) => (mapaFallos[b] || 1) - (mapaFallos[a] || 1))
                          .slice(0, 4)
                          .map((id) => `Art. ${id}`)
                          .join(', ')}`
                      : 'Sin fallos registrados en Modo Reto / Trampas'}
                  </div>
                </article>
              </div>

              {/* Barra de progreso visual con degradado y contador dinámico X / 169 Artículos */}
              <div className="gamificacion-progress-section">
                <div className="gamificacion-progress-header">
                  <span>Progreso de Dominio Constitucional (CE 1978)</span>
                  <span className="gamificacion-progress-counter">
                    {dominadosIds.length} / {constitucion_db.length} Artículos (
                    {((dominadosIds.length / constitucion_db.length) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div
                  className="gamificacion-progress-track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={constitucion_db.length}
                  aria-valuenow={dominadosIds.length}
                >
                  <div
                    className="gamificacion-progress-fill"
                    style={{
                      width: `${Math.min(100, (dominadosIds.length / constitucion_db.length) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <main id="mesa-trabajo" ref={mesaRef} className="mesa-trabajo"></main>
        </div>
      )}

      {/* VIEW 2: CÓDIGO FUENTE VANILLA JAVASCRIPT DE CONSTITUSOL */}
      {activeView === 'vanilla_js' && (
        <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                Código Completo de <code className="font-mono text-[#0284C7]">ConstituSol</code>
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Incluye el nuevo nombre <code className="font-mono">ConstituSol</code>, el desglose por apartados en <code className="font-mono">.card-back</code> con botón interactivo <code className="font-mono">📖 Ver BOE</code> y scroll vertical automático.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleCopy(VANILLA_JS_SOURCE, 'copy-js')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedKey === 'copy-js' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    JavaScript Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Código Vanilla JS
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadJs}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0b291d] rounded-lg hover:bg-[#154c37] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar app_mnemotecnia.js
              </button>
              <button
                onClick={handleDownloadSpaHtml}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileCode className="w-3.5 h-3.5" />
                Descargar simulador_mesa.html
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
              <span>public/app_mnemotecnia.js · ConstituSol</span>
              <span>Botón "📖 Ver BOE" + Scroll en .card-back</span>
            </div>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto max-h-[640px] overflow-y-auto leading-relaxed">
              {VANILLA_JS_SOURCE}
            </pre>
          </div>
        </main>
      )}

      {/* VIEW 3: JSON PURO CON SUBARTÍCULOS / APARTADOS */}
      {activeView === 'datos_ce' && (
        <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                ConstituSol · Base de Datos JSON por Apartados (<code className="font-mono text-[#0284C7]">169 Artículos · {totalApartadosCount} Apartados</code>)
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Estructura jerárquica con <code className="font-mono">id_articulo</code>, <code className="font-mono">tema_general</code>, <code className="font-mono">palabra_casillero</code>, <code className="font-mono">historia_mnemotecnica</code>, <code className="font-mono">prompt_imagen</code> y <code className="font-mono">apartados</code> (<code className="font-mono">id_apartado</code>, <code className="font-mono">concepto_clave</code>, <code className="font-mono">texto_oficial</code>).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  handleCopy(JSON.stringify(constitucion_json_puro, null, 2), 'copy-pure-json')
                }
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedKey === 'copy-pure-json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    JSON Puro Copiado (169 arts.)
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Array JSON Puro
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPureJson}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0b291d] rounded-lg hover:bg-[#154c37] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar constitucion_apartados.json
              </button>
              <button
                onClick={handleDownloadDatosCe}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileCode className="w-3.5 h-3.5" />
                Descargar datos_ce.js
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por id_articulo (ej. 4), id_apartado (ej. 4.1), casillero o texto..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJsonDisplayMode('raw_json')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  jsonDisplayMode === 'raw_json'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                JSON Puro ({filteredJsonArticles.length})
              </button>
              <button
                type="button"
                onClick={() => setJsonDisplayMode('fichas')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  jsonDisplayMode === 'fichas'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tarjetas con Apartados ({filteredJsonArticles.length})
              </button>
            </div>
          </div>

          {jsonDisplayMode === 'raw_json' ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                <span>
                  ConstituSol · Formato JSON Puro · Mostrando {filteredJsonArticles.length} de 169 artículos
                </span>
                <span>Propiedades: id_articulo, tema_general, palabra_casillero, historia_mnemotecnica, prompt_imagen, apartados</span>
              </div>
              <pre className="text-xs font-mono text-emerald-300 overflow-x-auto max-h-[640px] overflow-y-auto leading-relaxed">
                {pureJsonString}
              </pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredJsonArticles.slice(0, 30).map((art) => (
                <article
                  key={art.id_articulo}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-700">
                        id_articulo: "{art.id_articulo}" · Casillero: {art.palabra_casillero}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                        {art.tema_general}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(JSON.stringify(art, null, 2), `art-${art.id_articulo}`)
                      }
                      className="px-2.5 py-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer shrink-0"
                    >
                      {copiedKey === `art-${art.id_articulo}` ? 'Copiado' : 'Copiar JSON'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 bg-amber-50/70 border border-amber-200/70 rounded-lg p-3 leading-relaxed">
                    <strong className="text-amber-900">Historia Mnemotécnica:</strong>{' '}
                    {art.historia_mnemotecnica}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs font-mono font-semibold text-slate-500">
                      apartados ({art.apartados.length}):
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {art.apartados.map((ap) => (
                        <div
                          key={ap.id_apartado}
                          className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-xs font-bold text-sky-700 shrink-0">
                              {ap.id_apartado}
                            </span>
                            <span className="text-xs font-semibold text-slate-900">
                              {ap.concepto_clave}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                            {ap.texto_oficial}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {art.test_trampa && (
                    <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-rose-800">
                          🎯 test_trampa (indice_correcta: {art.test_trampa.indice_correcta})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">
                        {art.test_trampa.enunciado}
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {art.test_trampa.opciones.map((op, i) => (
                          <li
                            key={i}
                            className={`px-2 py-1 rounded ${
                              i === art.test_trampa.indice_correcta
                                ? 'bg-emerald-100/90 text-emerald-900 font-semibold'
                                : 'bg-white/80 text-slate-600'
                            }`}
                          >
                            <span className="font-mono font-bold mr-1.5">
                              {['A', 'B', 'C', 'D'][i]})
                            </span>
                            {op}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-rose-900 bg-rose-100/70 rounded p-2 leading-relaxed">
                        <strong>trampa_explicacion:</strong> {art.test_trampa.trampa_explicacion}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
