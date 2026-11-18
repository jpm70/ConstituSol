/**
 * Generador de preguntas trampa «de tribunal» a partir del texto literal del BOE.
 *
 * Cada distractor es la misma frase del artículo con UN solo detalle cambiado, como hacen los
 * tribunales de oposición: un plazo, una mayoría, un órgano, «podrá» por «deberá», «ley orgánica»
 * por «ley», «todos» por «los españoles»… Así la pregunta solo se acierta si se conoce el texto.
 *
 * Si la frase no tiene al menos tres detalles «cambiables», la pregunta pasa a ser de localización:
 * «¿En qué artículo se establece que…?» con artículos vecinos como distractores.
 */
import { temasGenerales } from './apartados_concepts';

export interface ApartadoLike {
  id_apartado: string;
  texto_oficial: string;
}

export interface TestTrampaLiteral {
  enunciado: string;
  opciones: [string, string, string, string];
  indice_correcta: number;
  trampa_explicacion: string;
}

interface Regla {
  /** Expresión que localiza el detalle (sin flags; se aplica sensible a mayúsculas en nombres propios). */
  re: RegExp;
  sustituir: (m: string) => string;
  /** Prioridad: cuanto menor, más típica de examen. */
  prioridad: number;
}

const NUM_SIGUIENTE: Record<string, string> = {
  un: 'dos', una: 'dos', uno: 'dos', dos: 'tres', tres: 'cuatro', cuatro: 'cinco', cinco: 'cuatro',
  seis: 'tres', siete: 'diez', ocho: 'diez', nueve: 'seis', diez: 'quince', doce: 'diez',
  quince: 'diez', veinte: 'treinta', treinta: 'quince', cuarenta: 'treinta', sesenta: 'noventa',
  noventa: 'sesenta', dieciocho: 'dieciséis', veinticuatro: 'cuarenta y ocho',
};
const PLURAL: Record<string, string> = { año: 'años', mes: 'meses', día: 'días', semana: 'semanas', hora: 'horas' };

function conservarMayuscula(original: string, nuevo: string): string {
  return /^[A-ZÁÉÍÓÚÑ]/.test(original) ? nuevo.charAt(0).toUpperCase() + nuevo.slice(1) : nuevo;
}

function cambiarCifra(txt: string): string {
  const n = parseInt(txt.replace(/\./g, ''), 10);
  if (!Number.isFinite(n)) return txt;
  const especiales: Record<number, number> = { 350: 300, 300: 350, 400: 350, 500000: 250000, 50: 60, 100: 150, 4: 5, 3: 4, 2: 3, 1: 2 };
  const nuevo = especiales[n] ?? (n >= 1000 ? Math.round(n / 2) : n * 2);
  return nuevo.toLocaleString('es-ES');
}

const W = '(?<![\\wáéíóúüñÁÉÍÓÚÜÑ])';
const E = '(?![\\wáéíóúüñÁÉÍÓÚÜÑ])';

const REGLAS: Regla[] = [
  // Plazos y cifras
  { re: new RegExp(`${W}setenta y dos horas${E}`, 'i'), sustituir: () => 'cuarenta y ocho horas', prioridad: 0 },
  { re: new RegExp(`${W}cuarenta y ocho horas${E}`, 'i'), sustituir: () => 'setenta y dos horas', prioridad: 0 },
  {
    re: new RegExp(`${W}(un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|doce|quince|veinte|treinta|cuarenta|sesenta|noventa|dieciocho|veinticuatro) (años?|meses|mes|días?|semanas?|horas?)${E}`, 'i'),
    sustituir: (m) => {
      const [num, unidad] = [m.split(' ')[0], m.split(' ').slice(1).join(' ')];
      const nuevoNum = NUM_SIGUIENTE[num.toLowerCase()] ?? num;
      const nuevaUnidad = ['un', 'una', 'uno'].includes(num.toLowerCase()) ? PLURAL[unidad.toLowerCase()] ?? unidad : unidad;
      return conservarMayuscula(num, `${nuevoNum} ${nuevaUnidad}`);
    },
    prioridad: 0,
  },
  // Cifras: solo las que cuentan algo (firmas, diputados, miembros, plazos), nunca números de artículo
  {
    re: new RegExp(`${W}\\d{1,3}(?:\\.\\d{3})*(?= (?:firmas|Diputados|Senadores|miembros|años|meses|días|horas)${E})`),
    sustituir: cambiarCifra,
    prioridad: 0,
  },
  // Mayorías y fracciones
  { re: new RegExp(`${W}mayoría absoluta${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'mayoría simple'), prioridad: 1 },
  { re: new RegExp(`${W}mayoría simple${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'mayoría absoluta'), prioridad: 1 },
  { re: new RegExp(`${W}dos tercios${E}`, 'i'), sustituir: () => 'tres quintos', prioridad: 1 },
  { re: new RegExp(`${W}tres quintos${E}`, 'i'), sustituir: () => 'dos tercios', prioridad: 1 },
  { re: new RegExp(`${W}(una|la) décima parte${E}`, 'i'), sustituir: (m) => m.replace(/décima/i, 'quinta'), prioridad: 1 },
  { re: new RegExp(`${W}(una|la) quinta parte${E}`, 'i'), sustituir: (m) => m.replace(/quinta/i, 'décima'), prioridad: 1 },
  // Órganos
  { re: /Congreso de los Diputados/, sustituir: () => 'Senado', prioridad: 2 },
  { re: new RegExp(`${W}Senado${E}`), sustituir: () => 'Congreso de los Diputados', prioridad: 2 },
  { re: /Tribunal Constitucional/, sustituir: () => 'Tribunal Supremo', prioridad: 2 },
  { re: /Tribunal Supremo/, sustituir: () => 'Tribunal Constitucional', prioridad: 2 },
  { re: /Consejo General del Poder Judicial/, sustituir: () => 'Ministerio de Justicia', prioridad: 2 },
  { re: /Defensor del Pueblo/, sustituir: () => 'Ministerio Fiscal', prioridad: 2 },
  { re: /Ministerio Fiscal/, sustituir: () => 'Defensor del Pueblo', prioridad: 2 },
  { re: /Presidente del Gobierno/, sustituir: () => 'Rey', prioridad: 2 },
  { re: new RegExp(`${W}Rey${E}`), sustituir: () => 'Presidente del Gobierno', prioridad: 2 },
  // «las Cortes Generales» → «el Congreso de los Diputados» (con su artículo y preposición, para que concuerde)
  {
    re: /(?:(de|a) )?([Ll])as Cortes Generales/,
    sustituir: (m) => {
      const prep = /^de /.test(m) ? 'del' : /^a /.test(m) ? 'al' : null;
      if (prep) return `${prep} Congreso de los Diputados`;
      return /^L/.test(m) ? 'El Congreso de los Diputados' : 'el Congreso de los Diputados';
    },
    prioridad: 2,
  },
  { re: /Consejo de Estado/, sustituir: () => 'Consejo de Ministros', prioridad: 2 },
  { re: /Tribunal de Cuentas/, sustituir: () => 'Banco de España', prioridad: 2 },
  { re: new RegExp(`${W}autoridad judicial${E}`, 'i'), sustituir: () => 'autoridad gubernativa', prioridad: 2 },
  { re: new RegExp(`${W}resolución judicial${E}`, 'i'), sustituir: () => 'resolución administrativa', prioridad: 2 },
  { re: new RegExp(`${W}Comunidades Autónomas${E}`), sustituir: () => 'Diputaciones Provinciales', prioridad: 3 },
  { re: new RegExp(`${W}el Gobierno${E}`), sustituir: () => 'el Consejo de Estado', prioridad: 3 },
  { re: new RegExp(`${W}El Gobierno${E}`), sustituir: () => 'El Consejo de Estado', prioridad: 3 },
  { re: new RegExp(`${W}provincias${E}`), sustituir: () => 'comarcas', prioridad: 4 },
  { re: new RegExp(`${W}provincia${E}`), sustituir: () => 'comarca', prioridad: 4 },
  { re: new RegExp(`${W}los municipios${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'las provincias'), prioridad: 4 },
  { re: new RegExp(`${W}Jueces y Magistrados${E}`), sustituir: () => 'Jueces y Fiscales', prioridad: 3 },
  { re: new RegExp(`${W}españoles${E}`), sustituir: () => 'ciudadanos residentes', prioridad: 5 },
  { re: new RegExp(`${W}los poderes públicos${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'las Comunidades Autónomas'), prioridad: 5 },
  // Rango normativo
  { re: new RegExp(`${W}leyes orgánicas${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'leyes ordinarias'), prioridad: 3 },
  { re: new RegExp(`${W}ley orgánica${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'ley ordinaria'), prioridad: 3 },
  { re: new RegExp(`${W}ley${E}(?! orgánica)`, 'i'), sustituir: (m) => conservarMayuscula(m, 'ley orgánica'), prioridad: 4 },
  // Verbos potestativos / imperativos y matices
  { re: new RegExp(`${W}podrán${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'deberán'), prioridad: 3 },
  { re: new RegExp(`${W}podrá${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'deberá'), prioridad: 3 },
  { re: new RegExp(`${W}deberán${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'podrán'), prioridad: 3 },
  { re: new RegExp(`${W}deberá${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'podrá'), prioridad: 3 },
  { re: new RegExp(`${W}en ningún caso${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'salvo autorización judicial'), prioridad: 3 },
  { re: new RegExp(`${W}en todo caso${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'en su caso'), prioridad: 4 },
  { re: new RegExp(`${W}garantiza${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'reconoce'), prioridad: 5 },
  { re: new RegExp(`${W}reconoce${E}`, 'i'), sustituir: (m) => conservarMayuscula(m, 'garantiza'), prioridad: 5 },
  // Titulares de derechos
  { re: /Todos tienen/, sustituir: () => 'Los españoles tienen', prioridad: 3 },
  { re: /Los españoles tienen/, sustituir: () => 'Todos tienen', prioridad: 3 },
  { re: new RegExp(`${W}tienen el derecho${E}`, 'i'), sustituir: () => 'tienen el deber', prioridad: 4 },
  { re: new RegExp(`${W}tienen el deber${E}`, 'i'), sustituir: () => 'tienen el derecho', prioridad: 4 },
];

interface Cambio {
  original: string;
  nuevo: string;
  inicio: number;
  prioridad: number;
}

/** Si el término nuevo ya aparece en la frase, el cambio se convierte en un intercambio de ambos. */
function otraAparicion(frase: string, nuevo: string, inicio: number, largo: number): number {
  let i = frase.indexOf(nuevo);
  while (i >= 0 && i < inicio + largo && i + nuevo.length > inicio) i = frase.indexOf(nuevo, i + 1);
  return i;
}

function cambiosPosibles(frase: string): Cambio[] {
  const cambios: Cambio[] = [];
  const resultados = new Set<string>();
  for (const regla of REGLAS) {
    const m = regla.re.exec(frase);
    if (!m) continue;
    const nuevo = regla.sustituir(m[0]);
    if (!nuevo || nuevo === m[0]) continue;
    // «Jueces y Fiscales» no engaña si la frase ya nombra a los Fiscales
    if (/Fiscales/.test(nuevo) && /Fiscal/.test(frase)) continue;
    const otra = otraAparicion(frase, nuevo, m.index, m[0].length);
    if (otra >= 0) {
      // En una enumeración («el Congreso y el Senado») intercambiar no cambia el sentido: se descarta
      const entre = otra > m.index ? frase.slice(m.index + m[0].length, otra) : frase.slice(otra + nuevo.length, m.index);
      if (/^[\s,]*(?:y|e|o|ni)?\s*(?:el|la|los|las)?\s*$/.test(entre)) continue;
    }
    const resultado = aplicar(frase, { original: m[0], nuevo, inicio: m.index, prioridad: regla.prioridad });
    if (resultados.has(resultado)) continue;
    resultados.add(resultado);
    // Un mismo tramo de texto solo puede cambiarse de una manera
    if (cambios.some((c) => m.index < c.inicio + c.original.length && c.inicio < m.index + m[0].length)) continue;
    cambios.push({ original: m[0], nuevo, inicio: m.index, prioridad: regla.prioridad });
  }
  return cambios.sort((a, b) => a.prioridad - b.prioridad || a.inicio - b.inicio);
}

function aplicar(frase: string, c: Cambio): string {
  const otra = otraAparicion(frase, c.nuevo, c.inicio, c.original.length);
  if (otra < 0) return frase.slice(0, c.inicio) + c.nuevo + frase.slice(c.inicio + c.original.length);
  // Intercambio: «del Rey … por el Presidente del Gobierno» → «del Presidente del Gobierno … por el Rey»
  const tramos = [
    { inicio: c.inicio, fin: c.inicio + c.original.length, texto: c.nuevo },
    { inicio: otra, fin: otra + c.nuevo.length, texto: c.original },
  ].sort((a, b) => b.inicio - a.inicio);
  let out = frase;
  for (const t of tramos) out = out.slice(0, t.inicio) + t.texto + out.slice(t.fin);
  return out;
}

/** Frases candidatas de cada apartado, sin numeración y sin letras de enumeración sueltas. */
function frases(apartados: ApartadoLike[]): { apartado: string; frase: string }[] {
  const out: { apartado: string; frase: string }[] = [];
  for (const ap of apartados) {
    const limpio = ap.texto_oficial.replace(/\s+/g, ' ').replace(/^\d+\.\s*/, '').trim();
    // Enumeraciones «Corresponde al Rey: a) … b) …»: cada letra, con su introducción, es una frase propia
    const enumeracion = limpio.match(/^(.{10,220}?:)\s*a\)\s/);
    if (enumeracion) {
      const intro = enumeracion[1];
      const items = limpio.slice(intro.length).split(/\s(?=[a-z]\)\s)/).map((x) => x.trim()).filter(Boolean);
      for (const item of items) {
        const t = `${intro} ${item}`.replace(/\s+/g, ' ').trim();
        if (t.length >= 40 && t.length <= 360) out.push({ apartado: ap.id_apartado, frase: t });
      }
    }
    for (const f of limpio.split(/(?<=[.:;])\s+(?=[A-ZÁÉÍÓÚÑ])/)) {
      const t = f.trim();
      if (t.length >= 40 && !/^[a-z]\)/.test(t)) out.push({ apartado: ap.id_apartado, frase: t });
    }
  }
  return out;
}

/** Recorta frases muy largas en un límite de cláusula que conserve los cambios elegidos. */
function recortar(frase: string, cambios: Cambio[], max = 320): { texto: string; cambios: Cambio[] } {
  if (frase.length <= max) return { texto: frase, cambios };
  const fin = Math.max(160, ...cambios.map((c) => c.inicio + c.original.length));
  const corte = frase.slice(fin).search(/[,;:]\s/);
  const hasta = corte >= 0 ? fin + corte : frase.length;
  if (hasta > max + 80) return { texto: frase, cambios };
  return { texto: frase.slice(0, hasta).trim() + '…', cambios };
}

function articulosVecinos(id: number): number[] {
  const candidatos = [id + 1, id - 1, id + 10, id - 10, id + 2, id - 2, id + 20];
  return candidatos.filter((n) => n >= 1 && n <= 169 && n !== id).slice(0, 3);
}

function preguntaDeLocalizacion(id: number, apartados: ApartadoLike[]): TestTrampaLiteral {
  const lista = frases(apartados);
  const base = lista.sort((a, b) => b.frase.length - a.frase.length)[0]
    ?? { apartado: String(id), frase: apartados[0]?.texto_oficial.replace(/^\d+\.\s*/, '') ?? '' };
  const texto = base.frase.length > 300 ? base.frase.slice(0, base.frase.lastIndexOf(' ', 300)) + '…' : base.frase;
  const vecinos = articulosVecinos(id);
  const opciones = [`En el artículo ${vecinos[0]}.`, `En el artículo ${id}.`, `En el artículo ${vecinos[1]}.`, `En el artículo ${vecinos[2]}.`] as [string, string, string, string];
  const pistas = vecinos
    .map((n) => `el ${n} trata sobre «${(temasGenerales[n] ?? '').toLowerCase()}»`)
    .join('; ');
  return {
    enunciado: `¿En qué artículo de la Constitución Española se establece lo siguiente? «${texto}»`,
    opciones,
    indice_correcta: 1,
    trampa_explicacion: `Es el artículo ${id} («${temasGenerales[id] ?? ''}»). Los tribunales preguntan mucho por la ubicación exacta: ${pistas}.`,
  };
}

export function construirTrampaLiteral(id: number, apartados: ApartadoLike[]): TestTrampaLiteral {
  // Frase con más detalles cambiables (a igualdad, la más corta y de mayor prioridad media)
  const candidatas = frases(apartados)
    .map((f) => ({ ...f, cambios: cambiosPosibles(f.frase) }))
    .filter((f) => f.cambios.length >= 2)
    .sort((a, b) => {
      // Primero frases legibles: sin enumeraciones a), b)… y de longitud razonable
      const castigo = (f: { frase: string }) => (/[a-z]\)\s/.test(f.frase) ? 2 : 0) + (f.frase.length > 300 ? 1 : 0);
      if (castigo(a) !== castigo(b)) return castigo(a) - castigo(b);
      const pa = a.cambios.slice(0, 3).reduce((s, c) => s + c.prioridad, 0);
      const pb = b.cambios.slice(0, 3).reduce((s, c) => s + c.prioridad, 0);
      return pa - pb || a.frase.length - b.frase.length;
    });

  if (candidatas.length === 0) return preguntaDeLocalizacion(id, apartados);

  const elegida = candidatas[0];
  const { texto, cambios } = recortar(elegida.frase, elegida.cambios.slice(0, 3));
  const distractores = cambios.map((c) => aplicar(texto, c));
  if (cambios.length === 2) {
    // Con solo dos detalles, la tercera opción incorrecta lleva los dos cambios a la vez
    const [c1, c2] = [...cambios].sort((a, b) => b.inicio - a.inicio);
    distractores.push(aplicar(aplicar(texto, c1), c2));
  }
  if (new Set([texto, ...distractores]).size < 4) return preguntaDeLocalizacion(id, apartados);

  const apartadoTxt = elegida.apartado.includes('.') ? `artículo ${elegida.apartado}` : `artículo ${id}`;
  const detalle = cambios.map((c) => `«${c.original}» por «${c.nuevo}»`).join('; ');
  return {
    enunciado: `Según el ${apartadoTxt} de la Constitución Española, señale la redacción literal correcta:`,
    opciones: [distractores[0], texto, distractores[1], distractores[2]] as [string, string, string, string],
    indice_correcta: 1,
    trampa_explicacion: `El texto literal del ${apartadoTxt} dice: «${texto}». Cada opción incorrecta cambia un solo detalle, como hacen los tribunales: ${detalle}.`,
  };
}
