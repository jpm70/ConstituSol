/**
 * ============================================================================
 * CONSTITUSOL — LÓGICA VANILLA JAVASCRIPT (SIMULADOR MNEMOTÉCNICO CE)
 * Incluye:
 * 1. Identidad "ConstituSol"
 * 2. Modo 1: Descubrimiento (Flashcards con desglose por apartados y botón "📖 Ver BOE")
 * 3. Modo 2: El Reto del Casillero (Pista mnemotécnica + Contenido Oficial BOE + Input numérico)
 * 4. Modo 3: Lluvia de Conceptos (Matching de números y temas generales)
 * 5. Modo 4: Cazador de Trampas (Test de oposición con 4 opciones mezcladas aleatoriamente,
 *    contador de aciertos, alerta de trampa + BOE vulnerado y botón "Ver anclaje mental")
 * 6. Mapa Constitucional (Mapa Mental estructural con acordeones por Títulos,
 *    minitarjetas con estados Verde/Amarillo/Gris en localStorage y Modal Rápido / salto a Modo 1).
 * ============================================================================
 */

(function () {
  const STORAGE_KEY_DOMINADOS = 'ce_articulos_dominados_v1';
  const STORAGE_KEY_REPASO = 'ce_articulos_repaso_v1';
  const STORAGE_KEY_CAZADOR_ACIERTOS = 'ce_cazador_aciertos_v1';

  // Claves de Gamificación y Retención en localStorage
  const STORAGE_KEY_ULTIMO_ACCESO = 'ultimo_acceso';
  const STORAGE_KEY_RACHA_ACTUAL = 'racha_actual';
  const STORAGE_KEY_MEJOR_RACHA = 'mejor_racha';
  const STORAGE_KEY_ARTICULOS_FALLOS = 'articulos_con_fallos';
  const STORAGE_KEY_MAPA_FALLOS = 'ce_mapa_fallos_v1';
  const TOTAL_ARTICULOS_CE = 169;


  // Estructura jerárquica oficial de la Constitución Española para el Mapa Constitucional
  const ESTRUCTURA_MAPA_CE = [
    {
      id_bloque: 'preambulo',
      sigla: 'PREÁMBULO',
      denominacion_oficial: 'Preámbulo de la Constitución Española',
      rango_etiqueta: 'Pórtico Solemne (27-12-1978)',
      subestructura_resumen: 'Declaración solemne de la Nación española, valores de convivencia democrática, Estado de Derecho, derechos humanos, progreso cultural y paz internacional.',
      items_especiales: [
        {
          codigo: 'Preámbulo',
          titulo: 'Preámbulo de la Constitución Española',
          concepto_clave: 'Convivencia democrática y Estado de Derecho',
          palabra_casillero: 'Aro (0)',
          historia_mnemotecnica: 'La Nación española atraviesa un gigantesco ARO dorado luminoso que proclama justicia, libertad, seguridad y paz entre todos los pueblos de la Tierra.',
          texto_oficial: 'La Nación española, deseando establecer la justicia, la libertad y la seguridad y promover el bien de cuantos la integran, en uso de su soberanía, proclama su voluntad de:\n- Garantizar la convivencia democrática dentro de la Constitución y de las leyes conforme a un orden económico y social justo.\n- Consolidar un Estado de Derecho que asegure el imperio de la ley como expresión de la voluntad popular.\n- Proteger a todos los españoles y pueblos de España en el ejercicio de los derechos humanos, sus culturas y tradiciones, lenguas e instituciones.\n- Promover el progreso de la cultura y de la economía para asegurar a todos una digna calidad de vida.\n- Establecer una sociedad democrática avanzada, y\n- Colaborar en el fortalecimiento de unas relaciones pacíficas y de eficaz cooperación entre todos los pueblos de la Tierra.\nEn consecuencia, las Cortes aprueban y el pueblo español ratifica la siguiente CONSTITUCIÓN.'
        }
      ]
    },
    {
      id_bloque: 'titulo_preliminar',
      sigla: 'TÍTULO PRELIMINAR',
      denominacion_oficial: 'Principios Generales y Valores Superiores del Estado',
      rango_etiqueta: 'Arts. 1 al 9',
      subestructura_resumen: 'Estado social y democrático de Derecho (Art. 1), unidad y autonomía (Art. 2), lenguas (Art. 3), bandera (Art. 4), capital (Art. 5), partidos y sindicatos (Arts. 6–7), Fuerzas Armadas (Art. 8) y garantías jurídicas (Art. 9).',
      rango_articulos: [1, 9]
    },
    {
      id_bloque: 'titulo_i',
      sigla: 'TÍTULO I',
      denominacion_oficial: 'De los derechos y deberes fundamentales',
      rango_etiqueta: 'Arts. 10 al 55',
      subestructura_resumen: 'Art. 10 (Dignidad) · Cap. I (Arts. 11–13) · Cap. II (Art. 14 + Secc. 1.ª Arts. 15–29 + Secc. 2.ª Arts. 30–38) · Cap. III (Arts. 39–52) · Cap. IV (Arts. 53–54) · Cap. V (Art. 55).',
      rango_articulos: [10, 55]
    },
    {
      id_bloque: 'titulo_ii',
      sigla: 'TÍTULO II',
      denominacion_oficial: 'De la Corona',
      rango_etiqueta: 'Arts. 56 al 65',
      subestructura_resumen: 'Jefatura del Estado, sucesión en la Corona, Regencia, tutela del Rey menor, juramento, funciones del Rey y refrendo.',
      rango_articulos: [56, 65]
    },
    {
      id_bloque: 'titulo_iii',
      sigla: 'TÍTULO III',
      denominacion_oficial: 'De las Cortes Generales',
      rango_etiqueta: 'Arts. 66 al 96',
      subestructura_resumen: 'Cap. I: De las Cámaras (Arts. 66–80) · Cap. II: De la elaboración de las leyes (Arts. 81–92) · Cap. III: De los Tratados Internacionales (Arts. 93–96).',
      rango_articulos: [66, 96]
    },
    {
      id_bloque: 'titulo_iv',
      sigla: 'TÍTULO IV',
      denominacion_oficial: 'Del Gobierno y de la Administración',
      rango_etiqueta: 'Arts. 97 al 107',
      subestructura_resumen: 'Dirección política, composición del Gobierno, investidura del Presidente (Art. 99), principios de la Administración Pública (Art. 103) y Consejo de Estado (Art. 107).',
      rango_articulos: [97, 107]
    },
    {
      id_bloque: 'titulo_v',
      sigla: 'TÍTULO V',
      denominacion_oficial: 'De las relaciones entre el Gobierno y las Cortes Generales',
      rango_etiqueta: 'Arts. 108 al 116',
      subestructura_resumen: 'Responsabilidad solidaria, cuestión de confianza (Art. 112), moción de censura (Art. 113), disolución de las Cámaras (Art. 115) y estados de alarma, excepción y sitio (Art. 116).',
      rango_articulos: [108, 116]
    },
    {
      id_bloque: 'titulo_vi',
      sigla: 'TÍTULO VI',
      denominacion_oficial: 'Del Poder Judicial',
      rango_etiqueta: 'Arts. 117 al 127',
      subestructura_resumen: 'Independencia judicial, unidad jurisdiccional, Consejo General del Poder Judicial (Art. 122), Tribunal Supremo (Art. 123) y Ministerio Fiscal (Art. 124).',
      rango_articulos: [117, 127]
    },
    {
      id_bloque: 'titulo_vii',
      sigla: 'TÍTULO VII',
      denominacion_oficial: 'Economía y Hacienda',
      rango_etiqueta: 'Arts. 128 al 136',
      subestructura_resumen: 'Riqueza nacional, potestad tributaria, Presupuestos Generales del Estado (Art. 134), estabilidad presupuestaria (Art. 135) y Tribunal de Cuentas (Art. 136).',
      rango_articulos: [128, 136]
    },
    {
      id_bloque: 'titulo_viii',
      sigla: 'TÍTULO VIII',
      denominacion_oficial: 'De la Organización Territorial del Estado',
      rango_etiqueta: 'Arts. 137 al 158',
      subestructura_resumen: 'Cap. I: Principios generales (Arts. 137–139) · Cap. II: Administración Local (Arts. 140–142) · Cap. III: Comunidades Autónomas (Arts. 143–158).',
      rango_articulos: [137, 158]
    },
    {
      id_bloque: 'titulo_ix',
      sigla: 'TÍTULO IX',
      denominacion_oficial: 'Del Tribunal Constitucional',
      rango_etiqueta: 'Arts. 159 al 165',
      subestructura_resumen: 'Composición de 12 miembros (Art. 159), competencias (Art. 161), legitimación (Art. 162), cuestión de inconstitucionalidad (Art. 163) y sentencias (Art. 164).',
      rango_articulos: [159, 165]
    },
    {
      id_bloque: 'titulo_x',
      sigla: 'TÍTULO X',
      denominacion_oficial: 'De la reforma constitucional',
      rango_etiqueta: 'Arts. 166 al 169',
      subestructura_resumen: 'Iniciativa de reforma (Art. 166), procedimiento ordinario 3/5 (Art. 167), procedimiento agravado 2/3 (Art. 168) y límites a la reforma (Art. 169).',
      rango_articulos: [166, 169]
    },
    {
      id_bloque: 'disposiciones',
      sigla: 'DISPOSICIONES',
      denominacion_oficial: 'Disposiciones Adicionales (4), Transitorias (9), Derogatoria y Final',
      rango_etiqueta: '15 Disposiciones Oficiales',
      subestructura_resumen: '4 Disposiciones Adicionales, 9 Disposiciones Transitorias, 1 Disposición Derogatoria y 1 Disposición Final.',
      items_especiales: [
        {
          codigo: 'D. Adicional 1.ª',
          titulo: 'Disposición adicional primera',
          concepto_clave: 'Derechos históricos de territorios forales',
          palabra_casillero: 'Hada (1)',
          historia_mnemotecnica: 'Un HADA madrina protege con un escudo brillante los fueros históricos enmarcados en la Constitución y los Estatutos.',
          texto_oficial: 'La Constitución ampara y respeta los derechos históricos de los territorios forales. La actualización general de dicho régimen foral se llevará a cabo, en su caso, en el marco de la Constitución y de los Estatutos de Autonomía.'
        },
        {
          codigo: 'D. Adicional 2.ª',
          titulo: 'Disposición adicional segunda',
          concepto_clave: 'Mayoría de edad y derechos forales',
          palabra_casillero: 'Heno (2)',
          historia_mnemotecnica: 'Un joven de 18 años salta sobre una bala de HENO sin perjudicar el pergamino de Derecho civil foral.',
          texto_oficial: 'La declaración de mayoría de edad contenida en el artículo 12 de esta Constitución no perjudica las situaciones amparadas por los derechos forales en el ámbito del Derecho privado.'
        },
        {
          codigo: 'D. Adicional 3.ª',
          titulo: 'Disposición adicional tercera',
          concepto_clave: 'Régimen económico y fiscal de Canarias',
          palabra_casillero: 'Humo (3)',
          historia_mnemotecnica: 'Del volcán Teide sale HUMO amarillo con un informe previo obligatorio antes de modificar el régimen canario.',
          texto_oficial: 'La modificación del régimen económico y fiscal del archipiélago canario requerirá informe previo de la Comunidad Autónoma o, en su caso, del órgano provisional autonómico.'
        },
        {
          codigo: 'D. Adicional 4.ª',
          titulo: 'Disposición adicional cuarta',
          concepto_clave: 'Sedes de Audiencias Territoriales',
          palabra_casillero: 'Oca (4)',
          historia_mnemotecnica: 'Una OCA con toga judicial reparte competencias entre varias Audiencias Territoriales bajo la LOPJ.',
          texto_oficial: 'En las Comunidades Autónomas donde tengan su sede más de una Audiencia Territorial, los Estatutos de Autonomía respectivos podrán mantener las existentes, distribuyendo las competencias entre ellas, siempre de conformidad con lo previsto en la ley orgánica del poder judicial y dentro de la unidad e independencia de éste.'
        },
        {
          codigo: 'D. Transitoria 1.ª',
          titulo: 'Disposición transitoria primera',
          concepto_clave: 'Sustitución de iniciativa autonómica provincial',
          palabra_casillero: 'Té (1)',
          historia_mnemotecnica: 'Los órganos preautonómicos brindan con tazas de TÉ por mayoría absoluta para sustituir la iniciativa provincial.',
          texto_oficial: 'En los territorios dotados de un régimen provisional de autonomía, sus órganos colegiados superiores, mediante acuerdo adoptado por la mayoría absoluta de sus miembros, podrán sustituir la iniciativa que en el apartado 2 del artículo 143 atribuye a las Diputaciones Provinciales o a los órganos interinsulares correspondientes.'
        },
        {
          codigo: 'D. Transitoria 2.ª',
          titulo: 'Disposición transitoria segunda',
          concepto_clave: 'Territorios con Estatutos plebiscitados en el pasado',
          palabra_casillero: 'Noé (2)',
          historia_mnemotecnica: 'NOÉ desembarca con antiguos Estatutos plebiscitados para acceder directamente al techo competencial del artículo 151.',
          texto_oficial: 'Los territorios que en el pasado hubiesen plebiscitado afirmativamente proyectos de Estatuto de autonomía y cuenten, al tiempo de promulgarse esta Constitución, con regímenes provisionales de autonomía podrán proceder inmediatamente en la forma que se prevé en el apartado 2 del artículo 148, cuando así lo acordaren, por mayoría absoluta, sus órganos preautonómicos colegiados superiores, comunicándolo al Gobierno.'
        },
        {
          codigo: 'D. Transitoria 3.ª',
          titulo: 'Disposición transitoria tercera',
          concepto_clave: 'Iniciativa autonómica diferida a elecciones locales',
          palabra_casillero: 'Amo (3)',
          historia_mnemotecnica: 'El AMO de las urnas municipales abre el calendario tras las primeras elecciones locales constitucionales.',
          texto_oficial: 'La iniciativa del proceso autonómico por parte de las Corporaciones locales o de sus miembros, prevista en el apartado 2 del artículo 143, se entiende diferida, con todos sus efectos, hasta la celebración de las primeras elecciones locales una vez vigente la Constitución.'
        },
        {
          codigo: 'D. Transitoria 4.ª',
          titulo: 'Disposición transitoria cuarta',
          concepto_clave: 'Régimen de incorporación de Navarra',
          palabra_casillero: 'Oca (4)',
          historia_mnemotecnica: 'Una OCA con pañuelo de San Fermín vota en el Órgano Foral competente y convoca referéndum en Navarra.',
          texto_oficial: '1. En el caso de Navarra, y a efectos de su incorporación al Consejo General Vasco o al régimen autonómico vasco que le sustituya, en lugar de lo que establece el artículo 143 de la Constitución, la iniciativa corresponde al Órgano Foral competente, el cual adoptará su decisión por mayoría de los miembros que lo componen. Para la validez de dicha iniciativa será preciso, además, que la decisión del Órgano Foral competente sea ratificada por referéndum expresamente convocado al efecto, y aprobado por mayoría de los votos válidos emitidos.'
        },
        {
          codigo: 'D. Transitoria 5.ª',
          titulo: 'Disposición transitoria quinta',
          concepto_clave: 'Autonomía de Ceuta y Melilla',
          palabra_casillero: 'Ola (5)',
          historia_mnemotecnica: 'Una OLA gigante del Estrecho une los Ayuntamientos de Ceuta y Melilla por mayoría absoluta y ley orgánica de las Cortes.',
          texto_oficial: 'Las ciudades de Ceuta y Melilla podrán constituirse en Comunidades Autónomas si así lo deciden sus respectivos Ayuntamientos, mediante acuerdo adoptado por la mayoría absoluta de sus miembros y así lo autorizan las Cortes Generales, mediante una ley orgánica, en los términos previstos en el artículo 144.'
        },
        {
          codigo: 'D. Transitoria 6.ª',
          titulo: 'Disposición transitoria sexta',
          concepto_clave: 'Orden de dictamen de Estatutos en Comisión',
          palabra_casillero: 'Oso (6)',
          historia_mnemotecnica: 'Un OSO con cronómetro ordena la fila de Estatutos por orden de entrada en la Comisión Constitucional del Congreso.',
          texto_oficial: 'Cuando se remitieran a la Comisión Constitucional del Congreso varios proyectos de Estatuto, se dictaminarán por el orden de entrada en aquélla, y el plazo de dos meses a que se refiere el artículo 151 empezará a contar desde que la Comisión termine el estudio del proyecto o proyectos de que sucesivamente haya conocido.'
        },
        {
          codigo: 'D. Transitoria 7.ª',
          titulo: 'Disposición transitoria séptima',
          concepto_clave: 'Disolución de organismos provisionales autonómicos',
          palabra_casillero: 'Ufo (7)',
          historia_mnemotecnica: 'Un UFO abduce y disuelve los entes preautonómicos en cuanto nacen los órganos definitivos del Estatuto.',
          texto_oficial: 'Los organismos provisionales autonómicos se considerarán disueltos: a) Una vez constituidos los órganos que establezcan los Estatutos; b) Si la iniciativa no llegara a prosperar; c) Si no hubiera ejercido el derecho en el plazo de tres años.'
        },
        {
          codigo: 'D. Transitoria 8.ª',
          titulo: 'Disposición transitoria octava',
          concepto_clave: 'Cámaras constituyentes y Presidencia del Gobierno',
          palabra_casillero: 'Hacha (8)',
          historia_mnemotecnica: 'Un HACHA corta el calendario el 15 de junio de 1981 y abre un plazo de 30 días para aplicar el artículo 99.',
          texto_oficial: 'Las Cámaras que han aprobado la presente Constitución asumirán, tras la entrada en vigor de la misma, las funciones y competencias que en ella se señalan, respectivamente, para el Congreso y el Senado, sin que en ningún caso su mandato se extienda más allá del 15 de junio de 1981.'
        },
        {
          codigo: 'D. Transitoria 9.ª',
          titulo: 'Disposición transitoria novena',
          concepto_clave: 'Primera renovación por sorteo del TC',
          palabra_casillero: 'Oveja (9)',
          historia_mnemotecnica: 'Una OVEJA saca bolas de un bombo de lotería a los 3 y 6 años para renovar por tercios a los primeros magistrados del TC.',
          texto_oficial: 'A los tres años de la elección por vez primera de los miembros del Tribunal Constitucional se procederá por sorteo para la designación de un grupo de cuatro miembros de la misma procedencia electiva que haya de cesar y renovarse.'
        },
        {
          codigo: 'D. Derogatoria',
          titulo: 'Disposición derogatoria',
          concepto_clave: 'Derogación de Leyes Fundamentales y leyes de 1839/1876',
          palabra_casillero: 'Toro (10)',
          historia_mnemotecnica: 'Un TORO embiste y deroga la Ley para la Reforma Política de 1977, las siete Leyes Fundamentales y las leyes de 1839 y 1876.',
          texto_oficial: 'Queda derogada la Ley 1/1977, de 4 de enero, para la Reforma Política, las Leyes Fundamentales, las leyes de 25 de octubre de 1839 y de 21 de julio de 1876, y cuantas disposiciones se opongan a lo establecido en esta Constitución.'
        },
        {
          codigo: 'D. Final',
          titulo: 'Disposición final',
          concepto_clave: 'Entrada en vigor el mismo día de su publicación en el BOE',
          palabra_casillero: 'Dado (11)',
          historia_mnemotecnica: 'Un DADO gigante cae sobre el BOE el 29 de diciembre de 1978 haciendo que la Constitución entre en vigor el mismo día de su publicación.',
          texto_oficial: 'Esta Constitución entrará en vigor el mismo día de la publicación de su texto oficial en el boletín oficial del Estado. Se publicará también en las demás lenguas de España.'
        }
      ]
    }
  ];

  // Asegurar título de documento ConstituSol
  if (typeof document !== 'undefined') {
    document.title = 'ConstituSol — Simulador Mnemotécnico de la Constitución Española';
  }

  // Referencias principales del DOM
  const contenedorMesa = document.getElementById('mesa-trabajo');
  const botonesModo = document.querySelectorAll('[data-modo]');
  const selectorModoDropdown = document.getElementById('selector-modo');
  const selectorFiltroDominio = document.getElementById('filtro-dominio');
  const contadorDominadosEl = document.getElementById('contador-dominados');
  const btnResetProgreso = document.getElementById('btn-reset-progreso');

  // Estado global de la sesión de estudio
  let modoActual = 'modo1';
  let filtroDominio = 'todos'; // 'todos' | 'no_dominados' | 'dominados' | 'con_fallos'
  let indiceDescubrimiento = 0;
  let aciertosCazador = leerAciertosCazador();
  let bloquesAbiertosMapa = new Set(['titulo_preliminar', 'titulo_i']);

  // Estado para Modo 3 (Lluvia de Conceptos / Matching)
  let seleccionNumeroId = null;
  let seleccionConceptoId = null;
  let parejasResueltas = 0;

  /**
   * ==========================================================================
   * 1A. MÓDULO DE GESTIÓN DE RACHAS (STREAK SYSTEM) Y CÁLCULO DE FECHAS
   * ==========================================================================
   */
  function formatearFechaLocalISO(fecha = new Date()) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  function obtenerFechaAyerISO(fechaReferencia = new Date()) {
    const copia = new Date(
      fechaReferencia.getFullYear(),
      fechaReferencia.getMonth(),
      fechaReferencia.getDate()
    );
    copia.setDate(copia.getDate() - 1);
    return formatearFechaLocalISO(copia);
  }

  function comprobarYActualizarRacha() {
    const hoyISO = formatearFechaLocalISO(new Date());
    const ayerISO = obtenerFechaAyerISO(new Date());

    let ultimoAcceso = null;
    let rachaActual = 0;
    let mejorRacha = 0;

    try {
      ultimoAcceso = localStorage.getItem(STORAGE_KEY_ULTIMO_ACCESO);
      rachaActual = parseInt(localStorage.getItem(STORAGE_KEY_RACHA_ACTUAL) || '0', 10) || 0;
      mejorRacha = parseInt(localStorage.getItem(STORAGE_KEY_MEJOR_RACHA) || '0', 10) || 0;
    } catch (err) {
      console.error('Error leyendo racha en localStorage:', err);
    }

    if (ultimoAcceso === hoyISO) {
      // Si ultimo_acceso es igual a hoy: no cambia la racha (mínimo 1 si acaba de empezar)
      if (rachaActual <= 0) rachaActual = 1;
    } else if (ultimoAcceso === ayerISO) {
      // Si ultimo_acceso fue ayer: suma +1 a racha_actual
      rachaActual = rachaActual + 1;
    } else {
      // Si ultimo_acceso fue anterior a ayer o no existía: resetea racha_actual a 1
      rachaActual = 1;
    }

    if (rachaActual > mejorRacha) {
      mejorRacha = rachaActual;
    }

    try {
      localStorage.setItem(STORAGE_KEY_ULTIMO_ACCESO, hoyISO);
      localStorage.setItem(STORAGE_KEY_RACHA_ACTUAL, String(rachaActual));
      localStorage.setItem(STORAGE_KEY_MEJOR_RACHA, String(mejorRacha));
    } catch (err) {
      console.error('Error guardando racha en localStorage:', err);
    }

    return {
      ultimo_acceso: hoyISO,
      racha_actual: rachaActual,
      mejor_racha: mejorRacha
    };
  }

  function leerEstadoRacha() {
    try {
      const hoyISO = formatearFechaLocalISO(new Date());
      const ultimoAcceso = localStorage.getItem(STORAGE_KEY_ULTIMO_ACCESO) || hoyISO;
      const rachaActual = Math.max(
        1,
        parseInt(localStorage.getItem(STORAGE_KEY_RACHA_ACTUAL) || '1', 10) || 1
      );
      const mejorRacha = Math.max(
        rachaActual,
        parseInt(localStorage.getItem(STORAGE_KEY_MEJOR_RACHA) || '1', 10) || 1
      );
      return {
        ultimo_acceso: ultimoAcceso,
        racha_actual: rachaActual,
        mejor_racha: mejorRacha
      };
    } catch {
      return {
        ultimo_acceso: formatearFechaLocalISO(new Date()),
        racha_actual: 1,
        mejor_racha: 1
      };
    }
  }

  /**
   * ==========================================================================
   * 1B. FUNCIONES DE PERSISTENCIA EN LOCALSTORAGE (DOMINADOS, REPASO Y FALLOS)
   * ==========================================================================
   */
  function leerArticulosDominados() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_DOMINADOS);
      if (!guardado) return [];
      const parseado = JSON.parse(guardado);
      return Array.isArray(parseado) ? parseado.map(Number) : [];
    } catch (err) {
      console.error('Error leyendo localStorage:', err);
      return [];
    }
  }

  function leerArticulosEnRepaso() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_REPASO);
      if (!guardado) return [];
      const parseado = JSON.parse(guardado);
      return Array.isArray(parseado) ? parseado.map(Number) : [];
    } catch {
      return [];
    }
  }

  function leerArticulosConFallos() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_ARTICULOS_FALLOS);
      if (!guardado) return [];
      const parseado = JSON.parse(guardado);
      return Array.isArray(parseado) ? parseado.map(Number) : [];
    } catch {
      return [];
    }
  }

  function leerMapaFallos() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_MAPA_FALLOS);
      if (!guardado) return {};
      const parseado = JSON.parse(guardado);
      return parseado && typeof parseado === 'object' ? parseado : {};
    } catch {
      return {};
    }
  }

  function registrarFalloArticulo(idArticulo) {
    const idNum = Number(idArticulo);
    const listaFallos = leerArticulosConFallos();
    if (!listaFallos.includes(idNum)) {
      listaFallos.push(idNum);
    }

    const mapaFallos = leerMapaFallos();
    mapaFallos[idNum] = (Number(mapaFallos[idNum]) || 0) + 1;

    try {
      localStorage.setItem(STORAGE_KEY_ARTICULOS_FALLOS, JSON.stringify(listaFallos));
      localStorage.setItem(STORAGE_KEY_MAPA_FALLOS, JSON.stringify(mapaFallos));
    } catch (err) {
      console.error('Error guardando fallo de artículo en localStorage:', err);
    }

    marcarArticuloEnRepaso(idNum);
    actualizarContadorDominadosUI();
  }

  function guardarArticuloDominado(idArticulo) {
    const idNum = Number(idArticulo);
    const dominados = leerArticulosDominados();
    if (!dominados.includes(idNum)) {
      dominados.push(idNum);
      try {
        localStorage.setItem(STORAGE_KEY_DOMINADOS, JSON.stringify(dominados));
      } catch (err) {
        console.error('Error guardando en localStorage:', err);
      }
    }
    // Si pasa a dominado, lo quitamos de la lista de repaso pendiente
    const repaso = leerArticulosEnRepaso().filter((x) => x !== idNum);
    try {
      localStorage.setItem(STORAGE_KEY_REPASO, JSON.stringify(repaso));
    } catch {
      // ignore
    }
    actualizarContadorDominadosUI();
  }

  function marcarArticuloEnRepaso(idArticulo) {
    const idNum = Number(idArticulo);
    if (esArticuloDominado(idNum)) return;
    const repaso = leerArticulosEnRepaso();
    if (!repaso.includes(idNum)) {
      repaso.push(idNum);
      try {
        localStorage.setItem(STORAGE_KEY_REPASO, JSON.stringify(repaso));
      } catch {
        // ignore
      }
    }
    actualizarContadorDominadosUI();
  }

  function establecerEstadoArticulo(idArticulo, nuevoEstado) {
    const idNum = Number(idArticulo);
    let dominados = leerArticulosDominados().filter((x) => x !== idNum);
    let repaso = leerArticulosEnRepaso().filter((x) => x !== idNum);

    if (nuevoEstado === 'dominado') {
      dominados.push(idNum);
    } else if (nuevoEstado === 'repaso') {
      repaso.push(idNum);
    }

    try {
      localStorage.setItem(STORAGE_KEY_DOMINADOS, JSON.stringify(dominados));
      localStorage.setItem(STORAGE_KEY_REPASO, JSON.stringify(repaso));
    } catch {
      // ignore
    }
    actualizarContadorDominadosUI();
  }

  function obtenerEstadoArticulo(idArticulo) {
    const idNum = Number(idArticulo);
    if (leerArticulosDominados().includes(idNum)) return 'dominado';
    if (leerArticulosEnRepaso().includes(idNum)) return 'repaso';
    return 'no_estudiado';
  }

  function esArticuloDominado(idArticulo) {
    const dominados = leerArticulosDominados();
    return dominados.includes(Number(idArticulo));
  }

  function leerAciertosCazador() {
    try {
      const val = localStorage.getItem(STORAGE_KEY_CAZADOR_ACIERTOS);
      return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
    } catch {
      return 0;
    }
  }

  function incrementarAciertosCazador() {
    aciertosCazador += 1;
    try {
      localStorage.setItem(STORAGE_KEY_CAZADOR_ACIERTOS, String(aciertosCazador));
    } catch {
      // ignore
    }
    return aciertosCazador;
  }

  function reiniciarProgresoDominados() {
    try {
      localStorage.removeItem(STORAGE_KEY_DOMINADOS);
      localStorage.removeItem(STORAGE_KEY_REPASO);
      localStorage.removeItem(STORAGE_KEY_CAZADOR_ACIERTOS);
      localStorage.removeItem(STORAGE_KEY_ARTICULOS_FALLOS);
      localStorage.removeItem(STORAGE_KEY_MAPA_FALLOS);
    } catch (err) {
      console.error('Error limpiando localStorage:', err);
    }
    aciertosCazador = 0;
    if (filtroDominio === 'con_fallos') {
      filtroDominio = 'todos';
      if (selectorFiltroDominio) selectorFiltroDominio.value = 'todos';
    }
    actualizarContadorDominadosUI();
    indiceDescubrimiento = 0;
    cambiarModo(modoActual);
  }

  /**
   * ==========================================================================
   * 1C. PANEL DE ESTADÍSTICAS REACTIVO (DASHBOARD SUPERIOR + FILTRO RÁPIDO)
   * ==========================================================================
   */
  function obtenerEstadisticasGlobales() {
    const dbTotal = obtenerBaseDatosCompleta().length || TOTAL_ARTICULOS_CE;
    const dominados = leerArticulosDominados();
    const fallosIds = leerArticulosConFallos();
    const mapaFallos = leerMapaFallos();
    const rachaInfo = leerEstadoRacha();

    const dominadosCount = dominados.length;
    const pendientesCount = Math.max(0, dbTotal - dominadosCount);
    const porcentaje = dbTotal > 0 ? Number(((dominadosCount / dbTotal) * 100).toFixed(1)) : 0;

    // Ordenar artículos con más fallos para mostrarlos como alerta rápida
    const topFallos = [...fallosIds]
      .sort((a, b) => (Number(mapaFallos[b]) || 1) - (Number(mapaFallos[a]) || 1))
      .slice(0, 4);

    return {
      dbTotal,
      dominadosCount,
      pendientesCount,
      porcentaje,
      fallosCount: fallosIds.length,
      topFallos,
      rachaActual: rachaInfo.racha_actual,
      mejorRacha: rachaInfo.mejor_racha,
      ultimoAcceso: rachaInfo.ultimo_acceso
    };
  }

  function renderizarOActualizarDashboardGamificacion() {
    if (!contenedorMesa || !contenedorMesa.parentElement) return;
    const stats = obtenerEstadisticasGlobales();

    let panelDashboard = document.getElementById('gamificacion-dashboard');
    if (!panelDashboard) {
      panelDashboard = document.createElement('section');
      panelDashboard.id = 'gamificacion-dashboard';
      panelDashboard.className = 'gamificacion-dashboard';
      panelDashboard.setAttribute('aria-label', 'Panel de Estadísticas y Racha de Estudio');
      contenedorMesa.parentElement.insertBefore(panelDashboard, contenedorMesa);
    }

    const textoDiasRacha =
      stats.rachaActual === 1 ? '1 día seguido' : `${stats.rachaActual} días seguidos`;
    const detalleTopFallos =
      stats.topFallos.length > 0
        ? `Más fallados: ${stats.topFallos.map((id) => `Art. ${id}`).join(', ')}`
        : 'Sin fallos registrados en Modo Reto / Trampas';

    const filtroFallosActivo = filtroDominio === 'con_fallos';

    panelDashboard.innerHTML = `
      <div class="gamificacion-panel-inner">
        <div class="gamificacion-top-bar">
          <div class="gamificacion-title-group">
            <h2 class="gamificacion-title">📊 Panel de Rendimiento y Motivación · ConstituSol</h2>
            <span class="gamificacion-subtitle-pill">Persistencia LocalStorage Activa</span>
          </div>
          <div class="gamificacion-actions">
            <button
              type="button"
              id="btn-filtro-rapido-fallos"
              class="btn-repasar-fallos ${filtroFallosActivo ? 'is-active-filter' : ''}"
            >
              <span>⚠️ ${filtroFallosActivo ? 'Viendo solo artículos con fallos (Ver todos)' : 'Repasar solo artículos con fallos'}</span>
              <span class="btn-repasar-fallos-count">${stats.fallosCount}</span>
            </button>
          </div>
        </div>

        <div class="gamificacion-kpi-grid">
          <!-- Tarjeta 1: Racha Activa -->
          <article class="gamificacion-kpi-card kpi-racha">
            <div class="gamificacion-kpi-label">
              <span>🔥 Racha Activa</span>
              <span>Récord: ${stats.mejorRacha}d</span>
            </div>
            <div class="gamificacion-kpi-value" id="kpi-racha-valor">${textoDiasRacha}</div>
            <div class="gamificacion-kpi-sub">Último acceso: ${stats.ultimoAcceso}</div>
          </article>

          <!-- Tarjeta 2: Porcentaje Global Completado -->
          <article class="gamificacion-kpi-card kpi-porcentaje">
            <div class="gamificacion-kpi-label">
              <span>🎯 Porcentaje Global</span>
              <span>Meta: 100%</span>
            </div>
            <div class="gamificacion-kpi-value" id="kpi-porcentaje-valor">${stats.porcentaje}%</div>
            <div class="gamificacion-kpi-sub">Calculado sobre los ${stats.dbTotal} artículos de la CE</div>
          </article>

          <!-- Tarjeta 3: Dominados vs. Pendientes -->
          <article class="gamificacion-kpi-card kpi-balance">
            <div class="gamificacion-kpi-label">
              <span>✅ Dominados vs. ⏳ Pendientes</span>
            </div>
            <div class="gamificacion-kpi-value" id="kpi-balance-valor">
              ${stats.dominadosCount} <span style="font-size:0.85rem;color:#94a3b8;font-weight:500;">vs.</span> ${stats.pendientesCount}
            </div>
            <div class="gamificacion-kpi-sub">✅ ${stats.dominadosCount} dominados · ⏳ ${stats.pendientesCount} pendientes</div>
          </article>

          <!-- Tarjeta 4: Artículos con Fallos Frecuentes -->
          <article class="gamificacion-kpi-card kpi-fallos">
            <div class="gamificacion-kpi-label">
              <span>⚠️ Artículos con Fallos</span>
              <span>Modo 2 y 4</span>
            </div>
            <div class="gamificacion-kpi-value" id="kpi-fallos-valor">${stats.fallosCount} arts.</div>
            <div class="gamificacion-kpi-sub">${detalleTopFallos}</div>
          </article>
        </div>

        <!-- Barra de progreso visual con degradado y contador dinámico X / 169 Artículos -->
        <div class="gamificacion-progress-section">
          <div class="gamificacion-progress-header">
            <span>Progreso de Dominio Constitucional (CE 1978)</span>
            <span class="gamificacion-progress-counter" id="gamificacion-progress-text">
              ${stats.dominadosCount} / ${stats.dbTotal} Artículos (${stats.porcentaje}%)
            </span>
          </div>
          <div class="gamificacion-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${stats.dbTotal}" aria-valuenow="${stats.dominadosCount}">
            <div class="gamificacion-progress-fill" style="width: ${Math.min(100, stats.porcentaje)}%;"></div>
          </div>
        </div>
      </div>
    `;

    const btnFiltroRapidoFallos = document.getElementById('btn-filtro-rapido-fallos');
    btnFiltroRapidoFallos?.addEventListener('click', () => {
      if (filtroDominio === 'con_fallos') {
        cambiarFiltroDominio('todos');
      } else {
        if (modoActual === 'mapa') {
          modoActual = 'modo2';
          actualizarControlesModo('modo2');
        }
        cambiarFiltroDominio('con_fallos');
      }
    });
  }

  function actualizarContadorDominadosUI() {
    const dbTotal = obtenerBaseDatosCompleta().length || TOTAL_ARTICULOS_CE;
    const totalDominados = leerArticulosDominados().length;
    if (contadorDominadosEl) {
      contadorDominadosEl.textContent = `Artículos Dominados: ${totalDominados} / ${dbTotal}`;
    }
    renderizarOActualizarDashboardGamificacion();
  }

  /**
   * 2. OBTENCIÓN Y NORMALIZACIÓN DE LA BASE DE DATOS (`constitucion_db`)
   */
  function obtenerBaseDatosCompleta() {
    if (typeof constitucion_db !== 'undefined' && Array.isArray(constitucion_db)) {
      return constitucion_db;
    }
    if (typeof window !== 'undefined' && Array.isArray(window.constitucion_db)) {
      return window.constitucion_db;
    }
    return [];
  }

  function obtenerIdNumerico(articulo) {
    return Number(articulo.id ?? articulo.id_articulo);
  }

  function obtenerTemaGeneral(articulo) {
    return articulo.tema_general || articulo.concepto_clave || '';
  }

  function obtenerApartadosArticulo(articulo) {
    const idArt = articulo.id_articulo || String(articulo.id);
    if (Array.isArray(articulo.apartados) && articulo.apartados.length > 0) {
      return articulo.apartados;
    }
    return [
      {
        id_apartado: `${idArt}.1`,
        concepto_clave: obtenerTemaGeneral(articulo),
        texto_oficial: articulo.texto_oficial || ''
      }
    ];
  }

  function obtenerArticulosFiltrados() {
    const db = obtenerBaseDatosCompleta();
    const dominadosSet = new Set(leerArticulosDominados());
    const fallosSet = new Set(leerArticulosConFallos());

    if (filtroDominio === 'dominados') {
      return db.filter((art) => dominadosSet.has(obtenerIdNumerico(art)));
    }
    if (filtroDominio === 'no_dominados') {
      return db.filter((art) => !dominadosSet.has(obtenerIdNumerico(art)));
    }
    if (filtroDominio === 'con_fallos') {
      return db.filter((art) => fallosSet.has(obtenerIdNumerico(art)));
    }
    return db;
  }

  function barajarArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  /**
   * Genera la ruta relativa oficial de la imagen mnemotécnica JPG de un artículo:
   * Patrón: "./assets/images/art_{id_articulo}.jpg" (ej. "./assets/images/art_1.jpg")
   */
  function obtenerRutaImagenArticulo(idArticulo) {
    const idLimpio = String(idArticulo).trim();
    return `./assets/images/art_${idLimpio}.jpg`;
  }

  /**
   * 3. BORRADO DEL CONTENEDOR PRINCIPAL AL CAMBIAR DE MODO O DE FILTRO
   */
  function limpiarMesaDeTrabajo() {
    if (!contenedorMesa) return;
    contenedorMesa.innerHTML = '';
    seleccionNumeroId = null;
    seleccionConceptoId = null;
    parejasResueltas = 0;
  }

  function renderizarEstadoVacioFiltro() {
    const etiquetaFiltro =
      filtroDominio === 'dominados'
        ? 'Solo los dominados'
        : filtroDominio === 'con_fallos'
        ? 'Solo artículos con fallos'
        : 'Solo los no dominados';

    const mensajeVacio =
      filtroDominio === 'dominados'
        ? 'Aún no has dominado ningún artículo en ConstituSol. Ve al «Modo 2: El Reto del Casillero» y acierta un artículo al primer intento para marcarlo como dominado.'
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

    document.getElementById('btn-volver-todos')?.addEventListener('click', () => {
      cambiarFiltroDominio('todos');
    });
  }

  function actualizarControlesModo(nuevoModo) {
    modoActual = nuevoModo;
    botonesModo.forEach((btn) => {
      const esActivo = btn.getAttribute('data-modo') === nuevoModo;
      btn.classList.toggle('is-active', esActivo);
      btn.setAttribute('aria-selected', esActivo ? 'true' : 'false');
    });
    if (selectorModoDropdown && selectorModoDropdown.value !== nuevoModo) {
      selectorModoDropdown.value = nuevoModo;
    }
  }

  function cambiarFiltroDominio(nuevoFiltro) {
    filtroDominio = nuevoFiltro;
    indiceDescubrimiento = 0;
    if (selectorFiltroDominio && selectorFiltroDominio.value !== nuevoFiltro) {
      selectorFiltroDominio.value = nuevoFiltro;
    }
    document.querySelectorAll('[data-filtro]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-filtro') === nuevoFiltro);
    });
    renderizarOActualizarDashboardGamificacion();
    cambiarModo(modoActual);
  }

  function cambiarModo(nuevoModo) {
    actualizarControlesModo(nuevoModo);
    actualizarContadorDominadosUI();
    limpiarMesaDeTrabajo();

    if (nuevoModo === 'mapa') {
      iniciarModoMapaConstitucional();
      return;
    }

    const mazoFiltrado = obtenerArticulosFiltrados();
    if (mazoFiltrado.length === 0) {
      renderizarEstadoVacioFiltro();
      return;
    }

    if (nuevoModo === 'modo1') {
      iniciarModoDescubrimiento(mazoFiltrado);
    } else if (nuevoModo === 'modo2') {
      iniciarModoRetoCasillero(mazoFiltrado);
    } else if (nuevoModo === 'modo3') {
      iniciarModoLluviaConceptos(mazoFiltrado);
    } else if (nuevoModo === 'modo4') {
      iniciarModoCazadorTrampas(mazoFiltrado);
    }
  }

  /* ==========================================================================
     MODO 1: DESCUBRIMIENTO (FLASHCARDS CON DESGLOSE DE APARTADOS Y "📖 Ver BOE")
     ========================================================================== */
  function iniciarModoDescubrimiento(mazo) {
    if (indiceDescubrimiento >= mazo.length) {
      indiceDescubrimiento = 0;
    }

    const manoCartas = mazo.slice(indiceDescubrimiento, indiceDescubrimiento + 6);

    const hud = document.createElement('section');
    hud.className = 'tablero-hud';
    hud.innerHTML = `
      <div class="hud-metrics">
        <span>ConstituSol · Modo 1: Descubrimiento</span>
        <span class="hud-separator">·</span>
        <span>Mostrando ${indiceDescubrimiento + 1}–${Math.min(indiceDescubrimiento + 6, mazo.length)} de ${mazo.length} artículos</span>
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
      const idNum = obtenerIdNumerico(articulo);
      const idStr = articulo.id_articulo || String(idNum);
      const temaGeneral = obtenerTemaGeneral(articulo);
      const apartados = obtenerApartadosArticulo(articulo);
      const dominado = esArticuloDominado(idNum);
      const imagenUrl = obtenerRutaImagenArticulo(idStr);

      const slot = document.createElement('div');
      slot.className = 'flashcard-slot';

      const cardInner = document.createElement('div');
      cardInner.className = 'flashcard-inner';
      cardInner.setAttribute('tabindex', '0');
      cardInner.setAttribute('role', 'button');

      const apartadosFrontHtml = apartados
        .map(
          (ap) => `
            <div class="apartado-front-item">
              <span class="apartado-id-code">${ap.id_apartado}</span>
              <span>${ap.concepto_clave}</span>
            </div>
          `
        )
        .join('');

      const apartadosBackHtml = apartados
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
            <span class="card-rank"><span class="card-suit">♠</span> Art. ${idStr}</span>
            <span class="card-meta-text">
              ${dominado ? '★ Dominado' : `${apartados.length} apartado(s)`}
            </span>
          </div>

          <div class="card-center-stage">
            <div class="casillero-emblem">${idStr}</div>
            <span class="casillero-label">Tema General</span>
            <h2 class="casillero-word">${temaGeneral}</h2>
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
            <span class="back-art-number">Art. ${idStr} · ${temaGeneral}</span>
            <span class="back-peg-pair">Casillero: <strong>${articulo.palabra_casillero}</strong></span>
          </div>

          <div class="back-body">
            <div class="card-media-frame">
              <img
                src="${imagenUrl}"
                alt="Escena surrealista del Artículo ${idStr}: ${articulo.palabra_casillero}"
                class="card-surreal-img"
                loading="lazy"
                onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.classList.remove('is-hidden');"
              />
              <div class="img-fallback-box is-hidden" aria-label="Cuadro de sustitución de escena mnemotécnica">
                <span class="img-fallback-badge">🎨 Casillero: ${articulo.palabra_casillero}</span>
                <span class="img-fallback-title">Artículo ${idStr} · ${temaGeneral}</span>
                <span class="img-fallback-sub">./assets/images/art_${idStr}.jpg · Escena en preparación</span>
              </div>
            </div>

            <div class="historia-box">
              <strong>${articulo.palabra_casillero}:</strong> ${articulo.historia_mnemotecnica}
            </div>

            <div class="back-apartados-section">
              <span class="back-apartados-title">Desglose por Apartados (${apartados.length})</span>
              ${apartadosBackHtml}
            </div>
          </div>

          <div class="back-footer">
            <span>${dominado ? '★ Artículo Dominado' : 'ConstituSol · Sistema Mayor'}</span>
            <span>Clic en tarjeta para volver ↺</span>
          </div>
        </div>
      `;

      const botonesBoe = cardInner.querySelectorAll('.btn-ver-boe');
      botonesBoe.forEach((btnBoe) => {
        btnBoe.addEventListener('click', (e) => {
          e.stopPropagation();
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
        marcarArticuloEnRepaso(idNum);
        cardInner.classList.toggle('is-flipped');
      });

      slot.appendChild(cardInner);
      rejilla.appendChild(slot);
    });

    contenedorMesa.appendChild(rejilla);

    document.getElementById('btn-prev-mano')?.addEventListener('click', () => {
      indiceDescubrimiento = Math.max(0, indiceDescubrimiento - 6);
      limpiarMesaDeTrabajo();
      iniciarModoDescubrimiento(obtenerArticulosFiltrados());
    });

    document.getElementById('btn-next-mano')?.addEventListener('click', () => {
      const actualMazo = obtenerArticulosFiltrados();
      indiceDescubrimiento =
        indiceDescubrimiento + 6 < actualMazo.length ? indiceDescubrimiento + 6 : 0;
      limpiarMesaDeTrabajo();
      iniciarModoDescubrimiento(actualMazo);
    });

    document.getElementById('btn-rand-mano')?.addEventListener('click', () => {
      const actualMazo = obtenerArticulosFiltrados();
      indiceDescubrimiento = Math.floor(Math.random() * Math.max(1, actualMazo.length - 6));
      limpiarMesaDeTrabajo();
      iniciarModoDescubrimiento(actualMazo);
    });
  }

  /* ==========================================================================
     MODO 2: EL RETO DEL CASILLERO (INVERSO) CON CONTENIDO OFICIAL BOE Y LOCALSTORAGE
     ========================================================================== */
  function iniciarModoRetoCasillero(mazo) {
    const articuloReto = mazo[Math.floor(Math.random() * mazo.length)];
    const idReto = obtenerIdNumerico(articuloReto);
    const idRetoStr = articuloReto.id_articulo || String(idReto);
    const temaReto = obtenerTemaGeneral(articuloReto);
    const apartadosReto = obtenerApartadosArticulo(articuloReto);
    const imagenUrl = obtenerRutaImagenArticulo(idRetoStr);
    let intentosRealizados = 0;

    const yaEstabaDominado = esArticuloDominado(idReto);

    const hud = document.createElement('section');
    hud.className = 'tablero-hud';
    hud.innerHTML = `
      <div class="hud-metrics">
        <span>ConstituSol · Modo 2: El Reto del Casillero</span>
        <span class="hud-separator">·</span>
        <span>Acierta al 1.er intento para marcar como Artículo Dominado</span>
      </div>
      <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-nuevo-reto">
        Siguiente Reto Aleatorio →
      </button>
    `;
    contenedorMesa.appendChild(hud);

    const escenarioReto = document.createElement('section');
    escenarioReto.className = 'reto-contenedor';

    const apartadosBoeHtml = apartadosReto
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
          <span class="img-fallback-sub">./assets/images/art_${idRetoStr}.jpg · Escena en preparación</span>
        </div>
      </div>

      <div class="reto-cuerpo">
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

        <section class="reto-boe-container" aria-label="Contenido oficial del artículo en el BOE">
          <div class="reto-boe-header">
            <h3 class="reto-boe-title">
              <span>📜</span>
              <span>Contenido Oficial del Artículo (BOE)</span>
            </h3>
            <span class="reto-boe-badge">
              ${apartadosReto.length} ${apartadosReto.length === 1 ? 'apartado oficial' : 'apartados oficiales'}
            </span>
          </div>
          <div class="reto-boe-apartados-list">
            ${apartadosBoeHtml}
          </div>
        </section>

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
              placeholder="Introduce el n.º de artículo (ej. 15)"
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

    const formulario = document.getElementById('form-adivinar-articulo');
    const inputNumero = document.getElementById('input-numero-art');
    const cajaFeedback = document.getElementById('reto-feedback');
    const badgeDominio = document.getElementById('badge-dominio-actual');

    inputNumero?.focus();

    formulario?.addEventListener('submit', (e) => {
      e.preventDefault();
      const valorUsuario = parseInt(inputNumero.value, 10);
      intentosRealizados += 1;

      tarjetaReto.classList.remove('is-correct', 'is-wrong');

      if (valorUsuario === idReto) {
        tarjetaReto.classList.add('is-correct');
        cajaFeedback.className = 'reto-feedback feedback-exito';

        if (intentosRealizados === 1) {
          guardarArticuloDominado(idReto);
          if (badgeDominio) {
            badgeDominio.textContent = '★ ¡Dominado al 1.er intento (Guardado en localStorage)!';
          }
          cajaFeedback.innerHTML = `
            <strong>¡Acierto al primer intento! Artículo ${idReto} marcado como DOMINADO en localStorage.</strong><br/>
            Palabra Casillero: <strong>${articuloReto.palabra_casillero}</strong> · Tema General: <em>${temaReto}</em>
          `;
        } else {
          marcarArticuloEnRepaso(idReto);
          cajaFeedback.innerHTML = `
            <strong>¡Correcto! Es el Artículo ${idReto}</strong> (acertado en el intento n.º ${intentosRealizados}).<br/>
            <em>Nota: Marcado en amarillo (En repaso). Solo pasa a verde (Dominado) si se acierta al primer intento.</em><br/>
            Palabra Casillero: <strong>${articuloReto.palabra_casillero}</strong> · Tema General: <em>${temaReto}</em>
          `;
        }
      } else {
        registrarFalloArticulo(idReto);
        tarjetaReto.classList.add('is-wrong');
        cajaFeedback.className = 'reto-feedback feedback-error';
        cajaFeedback.innerHTML = `
          <strong>Incorrecto (Intento n.º ${intentosRealizados}).</strong> Artículo añadido a «Artículos con fallos». Pista del Sistema Mayor: la palabra casillero de esta escena es
          <strong>«${articuloReto.palabra_casillero}»</strong>. ¡Convierte sus consonantes en números e inténtalo de nuevo!
        `;
      }
    });

    document.getElementById('btn-nuevo-reto')?.addEventListener('click', () => {
      cambiarModo('modo2');
    });
  }

  /* ==========================================================================
     MODO 3: LLUVIA DE CONCEPTOS (MATCHING)
     ========================================================================== */
  function iniciarModoLluviaConceptos(mazo) {
    const cantidadParejas = Math.min(5, mazo.length);
    const articulosRonda = barajarArray(mazo).slice(0, cantidadParejas);
    const tarjetasNumeros = [...articulosRonda];
    const tarjetasConceptos = barajarArray(articulosRonda);

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
    colNumeros.innerHTML = `<h3 class="matching-col-title">1. Selecciona un Número de Artículo</h3>`;

    const colConceptos = document.createElement('div');
    colConceptos.className = 'matching-column';
    colConceptos.innerHTML = `<h3 class="matching-col-title">2. Empareja su Tema General</h3>`;

    tarjetasNumeros.forEach((art) => {
      const idNum = obtenerIdNumerico(art);
      const btnNum = document.createElement('button');
      btnNum.type = 'button';
      btnNum.className = 'matching-card matching-card-num';
      btnNum.setAttribute('data-num-id', String(idNum));
      btnNum.innerHTML = `
        <span class="matching-badge">Artículo ${idNum}</span>
        <span class="matching-subhint">Casillero: ${art.palabra_casillero}</span>
      `;

      btnNum.addEventListener('click', () => {
        if (btnNum.classList.contains('is-matched')) return;
        colNumeros.querySelectorAll('.matching-card-num').forEach((el) => el.classList.remove('is-selected'));
        seleccionNumeroId = idNum;
        btnNum.classList.add('is-selected');
        verificarEmparejamiento(colNumeros, colConceptos, cantidadParejas);
      });

      colNumeros.appendChild(btnNum);
    });

    tarjetasConceptos.forEach((art) => {
      const idNum = obtenerIdNumerico(art);
      const btnCon = document.createElement('button');
      btnCon.type = 'button';
      btnCon.className = 'matching-card matching-card-concept';
      btnCon.setAttribute('data-concept-id', String(idNum));
      btnCon.innerHTML = `<span class="matching-concept-text">${obtenerTemaGeneral(art)}</span>`;

      btnCon.addEventListener('click', () => {
        if (btnCon.classList.contains('is-matched')) return;
        colConceptos.querySelectorAll('.matching-card-concept').forEach((el) => el.classList.remove('is-selected'));
        seleccionConceptoId = idNum;
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
      <strong>¡Ronda completada en ConstituSol!</strong> Has emparejado correctamente todos los artículos en pantalla.
    `;
    contenedorMesa.appendChild(bannerVictoria);

    document.getElementById('btn-nueva-lluvia')?.addEventListener('click', () => {
      cambiarModo('modo3');
    });
  }

  function verificarEmparejamiento(colNumeros, colConceptos, metaParejas) {
    if (seleccionNumeroId === null || seleccionConceptoId === null) return;

    const cardNum = colNumeros.querySelector(`[data-num-id="${seleccionNumeroId}"]`);
    const cardCon = colConceptos.querySelector(`[data-concept-id="${seleccionConceptoId}"]`);
    if (!cardNum || !cardCon) return;

    if (seleccionNumeroId === seleccionConceptoId) {
      marcarArticuloEnRepaso(seleccionNumeroId);
      cardNum.classList.remove('is-selected');
      cardCon.classList.remove('is-selected');
      cardNum.classList.add('is-matched');
      cardCon.classList.add('is-matched');
      cardNum.disabled = true;
      cardCon.disabled = true;

      parejasResueltas += 1;
      const contador = document.getElementById('contador-parejas');
      if (contador) contador.textContent = `Parejas resueltas: ${parejasResueltas} / ${metaParejas}`;

      if (parejasResueltas === metaParejas) {
        document.getElementById('matching-victoria')?.classList.remove('is-hidden');
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

  /* ==========================================================================
     MODO 4: CAZADOR DE TRAMPAS (TEST DE OPOSICIÓN CON 4 OPCIONES MEZCLADAS)
     ========================================================================== */
  function iniciarModoCazadorTrampas(mazo) {
    const articulo = mazo[Math.floor(Math.random() * mazo.length)];
    const idNum = obtenerIdNumerico(articulo);
    const idStr = articulo.id_articulo || String(idNum);
    const temaGeneral = obtenerTemaGeneral(articulo);
    const apartados = obtenerApartadosArticulo(articulo);
    const imagenUrl = obtenerRutaImagenArticulo(idStr);

    const testTrampa = articulo.test_trampa || {
      enunciado: `En relación con el artículo ${idStr} de la Constitución Española («${temaGeneral}»), señale la opción literal correcta:`,
      opciones: [
        'Requerirá autorización previa del Tribunal Constitucional en todo caso.',
        apartados[0]?.texto_oficial || articulo.texto_oficial || temaGeneral,
        'Exigirá mayoría de dos tercios del Senado en el plazo de 48 horas.',
        'Corresponderá en exclusiva al Consejo General del Poder Judicial.'
      ],
      indice_correcta: 1,
      trampa_explicacion: `Ojo al tenor literal del artículo ${idStr} en el BOE frente a los distractores de plazo, mayoría y órgano.`
    };

    const opcionesConMetadatos = testTrampa.opciones.map((textoOpcion, idxOriginal) => ({
      texto: textoOpcion,
      esCorrecta: idxOriginal === testTrampa.indice_correcta
    }));
    const opcionesMezcladas = barajarArray(opcionesConMetadatos);
    const letrasOpciones = ['A', 'B', 'C', 'D'];

    const textoBoeVulnerado = apartados
      .map((ap) => `[Apartado ${ap.id_apartado}] ${ap.texto_oficial}`)
      .join('\n\n');

    const hud = document.createElement('section');
    hud.className = 'tablero-hud';
    hud.innerHTML = `
      <div class="hud-metrics">
        <span>ConstituSol · Modo 4: Cazador de Trampas</span>
        <span class="hud-separator">·</span>
        <span id="hud-aciertos-cazador">🎯 Trampas Cazadas (Aciertos): ${aciertosCazador}</span>
      </div>
      <button type="button" class="btn-mesa btn-sm btn-mesa-primary" id="btn-siguiente-trampa">
        Siguiente Test Trampa →
      </button>
    `;
    contenedorMesa.appendChild(hud);

    const contenedorCazador = document.createElement('section');
    contenedorCazador.className = 'cazador-contenedor';

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
            <span class="cazador-opcion-letra">${letrasOpciones[idx]}</span>
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
          <span class="cazador-art-badge">🎯 Artículo ${idStr} CE</span>
          <span class="cazador-aciertos-pill" id="pill-aciertos-cazador">
            ✓ Aciertos acumulados: ${aciertosCazador}
          </span>
        </div>

        <div class="cazador-title-row">
          <h2 class="cazador-tema-titulo">${temaGeneral}</h2>
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
            <span class="img-fallback-title">Artículo ${idStr} · ${temaGeneral}</span>
            <span class="img-fallback-sub">./assets/images/art_${idStr}.jpg · Escena en preparación</span>
          </div>
        </div>
        <div class="cazador-anclaje-body">
          <span class="cazador-anclaje-peg">
            🔑 Palabra del Casillero (${idStr}): ${articulo.palabra_casillero}
          </span>
          <p class="cazador-anclaje-historia">
            <strong>Escena Mnemotécnica:</strong> ${articulo.historia_mnemotecnica}
          </p>
        </div>
      </section>

      <div class="cazador-enunciado-box">
        <span class="cazador-enunciado-label">Pregunta Oficial de Examen · Detalle Susceptible de Trampa</span>
        <p class="cazador-enunciado-texto">${testTrampa.enunciado}</p>
      </div>

      <div class="cazador-opciones-lista" role="group" aria-label="Opciones de respuesta">
        ${opcionesHtml}
      </div>

      <div id="cazador-alerta-box" class="cazador-alerta-trampa is-hidden" aria-live="polite"></div>
    `;

    contenedorCazador.appendChild(cardCazador);
    contenedorMesa.appendChild(contenedorCazador);

    const btnAnclaje = cardCazador.querySelector('#btn-toggle-anclaje');
    const panelAnclaje = cardCazador.querySelector('#panel-anclaje-mental');

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

    const botonesOpcion = cardCazador.querySelectorAll('.cazador-opcion-btn');
    const cajaAlerta = cardCazador.querySelector('#cazador-alerta-box');
    const pillAciertos = cardCazador.querySelector('#pill-aciertos-cazador');
    const hudAciertos = document.getElementById('hud-aciertos-cazador');

    botonesOpcion.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const esCorrecta = btn.getAttribute('data-es-correcta') === 'true';
        marcarArticuloEnRepaso(idNum);

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

          const nuevoTotal = incrementarAciertosCazador();
          if (pillAciertos) pillAciertos.textContent = `✓ Aciertos acumulados: ${nuevoTotal}`;
          if (hudAciertos) hudAciertos.textContent = `🎯 Trampas Cazadas (Aciertos): ${nuevoTotal}`;

          if (cajaAlerta) {
            cajaAlerta.className = 'cazador-alerta-trampa alerta-exito';
            cajaAlerta.innerHTML = `
              <div class="cazador-alerta-titulo">
                <span>✅</span>
                <span>¡Trampa Cazada! Has identificado el precepto exacto del Artículo ${idStr}</span>
              </div>
              <p class="cazador-alerta-explicacion">
                <strong>Claves del tribunal:</strong> ${testTrampa.trampa_explicacion}
              </p>
              <div class="cazador-boe-vulnerado">
                <span class="cazador-boe-vulnerado-label">📜 Texto Oficial Consolidado del BOE (Artículo ${idStr})</span>
                <p class="cazador-boe-vulnerado-texto">${textoBoeVulnerado}</p>
              </div>
            `;
          }
        } else {
          registrarFalloArticulo(idNum);
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
                <span>¡Alerta de Trampa de Examen en el Artículo ${idStr}!</span>
              </div>
              <p class="cazador-alerta-explicacion">
                <strong>¿Dónde estaba la trampa?:</strong> ${testTrampa.trampa_explicacion}
              </p>
              <div class="cazador-boe-vulnerado">
                <span class="cazador-boe-vulnerado-label">📜 Fragmento del Texto Oficial del BOE Vulnerado (Artículo ${idStr})</span>
                <p class="cazador-boe-vulnerado-texto">${textoBoeVulnerado}</p>
              </div>
            `;
          }
        }
      });
    });

    document.getElementById('btn-siguiente-trampa')?.addEventListener('click', () => {
      cambiarModo('modo4');
    });
  }

  /* ==========================================================================
     MAPA CONSTITUCIONAL (VISTA DE ÍNDICE ESTRUCTURAL, ACORDEONES Y MINITARJETAS)
     ========================================================================== */
  function iniciarModoMapaConstitucional() {
    const db = obtenerBaseDatosCompleta();
    const mapaArticulosPorId = new Map();
    db.forEach((art) => {
      mapaArticulosPorId.set(obtenerIdNumerico(art), art);
    });

    const setDominados = new Set(leerArticulosDominados());
    const setRepaso = new Set(leerArticulosEnRepaso());

    let totalVerde = 0;
    let totalAmarillo = 0;
    let totalGris = 0;

    for (let i = 1; i <= 169; i++) {
      if (setDominados.has(i)) totalVerde++;
      else if (setRepaso.has(i)) totalAmarillo++;
      else totalGris++;
    }

    const wrapperMapa = document.createElement('section');
    wrapperMapa.className = 'mapa-contenedor';

    // Barra superior de resumen estructural y leyenda de estados
    const resumenBar = document.createElement('div');
    resumenBar.className = 'mapa-resumen-bar';
    resumenBar.innerHTML = `
      <div class="mapa-resumen-top">
        <div>
          <h2 class="mapa-resumen-titulo">🗺️ Mapa Constitucional de España (Índice Estructural y Casillero)</h2>
          <p class=" hud-metrics">Haz clic en cualquier Título para desplegar sus minitarjetas y consultar su anclaje mental o el BOE íntegro.</p>
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
      const estaAbierto = bloquesAbiertosMapa.has(bloque.id_bloque);
      const itemAcordeon = document.createElement('article');
      itemAcordeon.className = `mapa-acordeon-item ${estaAbierto ? 'is-open' : ''}`;

      // Calcular estadísticas de este bloque
      let v = 0;
      let a = 0;
      let g = 0;

      if (bloque.rango_articulos) {
        const [ini, fin] = bloque.rango_articulos;
        for (let num = ini; num <= fin; num++) {
          if (setDominados.has(num)) v++;
          else if (setRepaso.has(num)) a++;
          else g++;
        }
      } else if (bloque.items_especiales) {
        g = bloque.items_especiales.length;
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
          const art = mapaArticulosPorId.get(num);
          if (!art) continue;

          const estado = obtenerEstadoArticulo(num);
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
            <div class="mapa-minicard-tema">${obtenerTemaGeneral(art)}</div>
          `;

          minicard.addEventListener('click', () => {
            if (obtenerEstadoArticulo(num) === 'no_estudiado') {
              marcarArticuloEnRepaso(num);
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
          bloquesAbiertosMapa.delete(bloque.id_bloque);
        } else {
          itemAcordeon.classList.add('is-open');
          bodyAcordeon.classList.remove('is-hidden');
          btnTrigger.setAttribute('aria-expanded', 'true');
          bloquesAbiertosMapa.add(bloque.id_bloque);
        }
      });
    });

    wrapperMapa.appendChild(listaAcordeones);
    contenedorMesa.appendChild(wrapperMapa);

    // Controles de Expandir / Contraer todos los acordeones
    document.getElementById('btn-expandir-todos-titulos')?.addEventListener('click', () => {
      ESTRUCTURA_MAPA_CE.forEach((b) => bloquesAbiertosMapa.add(b.id_bloque));
      limpiarMesaDeTrabajo();
      iniciarModoMapaConstitucional();
    });

    document.getElementById('btn-contraer-todos-titulos')?.addEventListener('click', () => {
      bloquesAbiertosMapa.clear();
      limpiarMesaDeTrabajo();
      iniciarModoMapaConstitucional();
    });
  }

  function abrirModalRapidoArticulo(articulo) {
    const idNum = obtenerIdNumerico(articulo);
    const idStr = articulo.id_articulo || String(idNum);
    const temaGeneral = obtenerTemaGeneral(articulo);
    const apartados = obtenerApartadosArticulo(articulo);
    const estadoActual = obtenerEstadoArticulo(idNum);
    const imagenUrl = obtenerRutaImagenArticulo(idStr);

    const overlay = document.createElement('div');
    overlay.className = 'mapa-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const apartadosHtml = apartados
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
            <span class="mapa-modal-badge">ConstituSol · Artículo ${idStr} CE · Casillero: ${articulo.palabra_casillero}</span>
            <h3 class="mapa-modal-title">${temaGeneral}</h3>
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
                <span class="img-fallback-title">Artículo ${idStr} · ${temaGeneral}</span>
                <span class="img-fallback-sub">./assets/images/art_${idStr}.jpg · Escena en preparación</span>
              </div>
            </div>
            <div class="cazador-anclaje-body">
              <span class="cazador-anclaje-peg">🔑 Palabra del Casillero (${idStr}): ${articulo.palabra_casillero}</span>
              <p class="cazador-anclaje-historia"><strong>Historia Mnemotécnica:</strong> ${articulo.historia_mnemotecnica}</p>
            </div>
          </div>

          <section class="reto-boe-container">
            <div class="reto-boe-header">
              <h4 class="reto-boe-title">📜 Texto Íntegro Oficial del BOE (Artículo ${idStr})</h4>
              <span class="reto-boe-badge">${apartados.length} apartado(s)</span>
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

    function cerrarModalYRefrescar() {
      overlay.remove();
      if (modoActual === 'mapa') {
        limpiarMesaDeTrabajo();
        iniciarModoMapaConstitucional();
      }
    }

    overlay.querySelector('#btn-cerrar-mapa-modal')?.addEventListener('click', cerrarModalYRefrescar);
    overlay.querySelector('#btn-modal-cerrar-sec')?.addEventListener('click', cerrarModalYRefrescar);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cerrarModalYRefrescar();
    });

    overlay.querySelectorAll('[data-set-status]').forEach((btnChoice) => {
      btnChoice.addEventListener('click', () => {
        const nuevoEst = btnChoice.getAttribute('data-set-status');
        establecerEstadoArticulo(idNum, nuevoEst);
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
      filtroDominio = 'todos';
      if (selectorFiltroDominio) selectorFiltroDominio.value = 'todos';
      indiceDescubrimiento = Math.max(0, idNum - 1);
      cambiarModo('modo1');
    });
  }

  function abrirModalRapidoEspecial(itemEsp) {
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

  /* ==========================================================================
     INICIALIZACIÓN DE EVENTOS DEL HEADER, FILTROS Y LOCALSTORAGE
     ========================================================================== */
  function inicializarSimulador() {
    botonesModo.forEach((btn) => {
      btn.addEventListener('click', () => {
        const modoElegido = btn.getAttribute('data-modo');
        if (modoElegido) cambiarModo(modoElegido);
      });
    });

    if (selectorModoDropdown) {
      selectorModoDropdown.addEventListener('change', (e) => {
        cambiarModo(e.target.value);
      });
    }

    if (selectorFiltroDominio) {
      selectorFiltroDominio.addEventListener('change', (e) => {
        cambiarFiltroDominio(e.target.value);
      });
    }

    document.querySelectorAll('[data-filtro]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nuevoFiltro = btn.getAttribute('data-filtro');
        if (nuevoFiltro) cambiarFiltroDominio(nuevoFiltro);
      });
    });

    btnResetProgreso?.addEventListener('click', () => {
      reiniciarProgresoDominados();
    });

    // 1. Comprobar y actualizar la racha diaria en localStorage al cargar la app
    comprobarYActualizarRacha();

    // 2. Renderizar el Panel de Estadísticas y el modo inicial
    actualizarContadorDominadosUI();
    cambiarModo('modo1');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSimulador);
  } else {
    inicializarSimulador();
  }
})();
