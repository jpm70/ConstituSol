/**
 * Preguntas tipo test del Preámbulo y de las Disposiciones de la Constitución.
 * Escritas a mano sobre el texto consolidado del BOE (BOE-A-1978-31229): la opción correcta
 * es siempre la literal y los distractores son las confusiones típicas del examen.
 * `codigo` coincide con el `codigo` de ESTRUCTURA_MAPA_CE para enlazar cada pregunta con su ficha.
 */
export interface PreguntaEspecialCE {
  codigo: string;
  enunciado: string;
  /** La primera opción es la correcta; la app las baraja al mostrarlas. */
  opciones: [string, string, string, string];
  explicacion: string;
}

export const PREGUNTAS_ESPECIALES: PreguntaEspecialCE[] = [
  // ── Preámbulo ──
  {
    codigo: 'Preámbulo',
    enunciado: 'Según el Preámbulo de la Constitución, ¿quién proclama, «en uso de su soberanía», su voluntad de garantizar la convivencia democrática?',
    opciones: ['La Nación española', 'El pueblo español', 'Las Cortes Generales', 'El Rey'],
    explicacion: 'Es «la Nación española» quien proclama su voluntad. El pueblo español aparece al final: «las Cortes aprueban y el pueblo español ratifica la siguiente Constitución».'
  },
  {
    codigo: 'Preámbulo',
    enunciado: 'Según el Preámbulo, la Nación española desea establecer:',
    opciones: [
      'la justicia, la libertad y la seguridad',
      'la libertad, la justicia, la igualdad y el pluralismo político',
      'la justicia, la paz y la seguridad',
      'la libertad, la igualdad y la seguridad'
    ],
    explicacion: 'El Preámbulo habla de «la justicia, la libertad y la seguridad». La libertad, la justicia, la igualdad y el pluralismo político son los valores superiores del artículo 1.1: no los confundas.'
  },
  {
    codigo: 'Preámbulo',
    enunciado: 'Según el Preámbulo, se quiere consolidar un Estado de Derecho que asegure:',
    opciones: [
      'el imperio de la ley como expresión de la voluntad popular',
      'la soberanía nacional como expresión de la voluntad popular',
      'el imperio de la ley como expresión de la soberanía nacional',
      'la separación de poderes como garantía de la voluntad popular'
    ],
    explicacion: 'Literal: «Consolidar un Estado de Derecho que asegure el imperio de la ley como expresión de la voluntad popular».'
  },
  {
    codigo: 'Preámbulo',
    enunciado: 'Según el Preámbulo, la convivencia democrática se garantiza dentro de la Constitución y de las leyes conforme a:',
    opciones: [
      'un orden económico y social justo',
      'una economía social de mercado',
      'un orden político y social justo',
      'los principios de justicia social y solidaridad'
    ],
    explicacion: 'Literal: «Garantizar la convivencia democrática dentro de la Constitución y de las leyes conforme a un orden económico y social justo».'
  },
  {
    codigo: 'Preámbulo',
    enunciado: 'Según el Preámbulo, el progreso de la cultura y de la economía se promueve para asegurar a todos:',
    opciones: ['una digna calidad de vida', 'un nivel de vida adecuado', 'una vivienda digna y adecuada', 'el pleno empleo'],
    explicacion: 'Literal: «Promover el progreso de la cultura y de la economía para asegurar a todos una digna calidad de vida». La vivienda digna y adecuada es del artículo 47.'
  },

  // ── Disposiciones adicionales ──
  {
    codigo: 'D. Adicional 1.ª',
    enunciado: 'La Constitución ampara y respeta los derechos históricos de:',
    opciones: ['los territorios forales', 'las nacionalidades y regiones', 'las Comunidades Autónomas', 'las provincias de régimen común'],
    explicacion: 'Disposición adicional primera: «La Constitución ampara y respeta los derechos históricos de los territorios forales».'
  },
  {
    codigo: 'D. Adicional 1.ª',
    enunciado: 'Según la disposición adicional primera, la actualización general del régimen foral se llevará a cabo, en su caso:',
    opciones: [
      'en el marco de la Constitución y de los Estatutos de Autonomía',
      'mediante ley orgánica aprobada por las Cortes Generales',
      'mediante convenio entre el Estado y los territorios forales',
      'en el marco de los Estatutos de Autonomía y de las leyes de armonización'
    ],
    explicacion: 'Literal: «se llevará a cabo, en su caso, en el marco de la Constitución y de los Estatutos de Autonomía».'
  },
  {
    codigo: 'D. Adicional 2.ª',
    enunciado: 'La declaración de mayoría de edad del artículo 12 no perjudica las situaciones amparadas por los derechos forales en el ámbito del:',
    opciones: ['Derecho privado', 'Derecho público', 'Derecho administrativo', 'Derecho civil común'],
    explicacion: 'Disposición adicional segunda: no perjudica las situaciones amparadas por los derechos forales «en el ámbito del Derecho privado».'
  },
  {
    codigo: 'D. Adicional 3.ª',
    enunciado: 'La modificación del régimen económico y fiscal del archipiélago canario requerirá:',
    opciones: [
      'informe previo de la Comunidad Autónoma o, en su caso, del órgano provisional autonómico',
      'autorización previa del Parlamento de Canarias por mayoría absoluta',
      'una ley orgánica aprobada por mayoría absoluta del Congreso',
      'dictamen previo del Consejo de Estado'
    ],
    explicacion: 'Disposición adicional tercera: basta un «informe previo» de la Comunidad Autónoma (o del órgano provisional autonómico). No es una autorización ni exige ley orgánica.'
  },
  {
    codigo: 'D. Adicional 4.ª',
    enunciado: 'En las Comunidades Autónomas donde tenga su sede más de una Audiencia Territorial, los Estatutos de Autonomía:',
    opciones: [
      'podrán mantener las existentes, distribuyendo las competencias entre ellas',
      'deberán suprimirlas y crear un único Tribunal Superior de Justicia',
      'podrán mantenerlas solo si lo autoriza el Consejo General del Poder Judicial',
      'deberán unificarlas en una sola Audiencia Territorial'
    ],
    explicacion: 'Disposición adicional cuarta: «podrán mantener las existentes, distribuyendo las competencias entre ellas», de conformidad con la ley orgánica del poder judicial.'
  },

  // ── Disposiciones transitorias ──
  {
    codigo: 'D. Transitoria 1.ª',
    enunciado: 'En los territorios con régimen provisional de autonomía, sus órganos colegiados superiores podrán sustituir la iniciativa autonómica del artículo 143.2 mediante acuerdo adoptado por:',
    opciones: ['la mayoría absoluta de sus miembros', 'la mayoría de tres quintos de sus miembros', 'la mayoría de dos tercios de sus miembros', 'la mayoría simple de los presentes'],
    explicacion: 'Disposición transitoria primera: «mediante acuerdo adoptado por la mayoría absoluta de sus miembros».'
  },
  {
    codigo: 'D. Transitoria 2.ª',
    enunciado: 'Los territorios que en el pasado hubiesen plebiscitado afirmativamente proyectos de Estatuto de autonomía podrán proceder inmediatamente en la forma prevista en:',
    opciones: ['el apartado 2 del artículo 148', 'el apartado 2 del artículo 143', 'el artículo 144', 'el apartado 1 del artículo 147'],
    explicacion: 'Disposición transitoria segunda: en la forma del apartado 2 del artículo 148, y el proyecto de Estatuto se elabora conforme al artículo 151.2. Es la vía de Cataluña, el País Vasco y Galicia.'
  },
  {
    codigo: 'D. Transitoria 3.ª',
    enunciado: 'La iniciativa del proceso autonómico por parte de las Corporaciones locales se entiende diferida, con todos sus efectos, hasta:',
    opciones: [
      'la celebración de las primeras elecciones locales una vez vigente la Constitución',
      'la aprobación de la ley de bases del régimen local',
      'la celebración de las primeras elecciones generales tras la Constitución',
      'la constitución de los órganos preautonómicos'
    ],
    explicacion: 'Disposición transitoria tercera: diferida «hasta la celebración de las primeras elecciones locales una vez vigente la Constitución».'
  },
  {
    codigo: 'D. Transitoria 4.ª',
    enunciado: 'En el caso de Navarra, a efectos de su incorporación al Consejo General Vasco o al régimen autonómico vasco que le sustituya, la iniciativa corresponde a:',
    opciones: [
      'el Órgano Foral competente, por mayoría de los miembros que lo componen',
      'las Cortes Generales, mediante ley orgánica',
      'el Gobierno, a propuesta de la Diputación Foral',
      'los Ayuntamientos navarros, por mayoría absoluta'
    ],
    explicacion: 'Disposición transitoria cuarta: la iniciativa corresponde «al Órgano Foral competente, el cual adoptará su decisión por mayoría de los miembros que lo componen».'
  },
  {
    codigo: 'D. Transitoria 4.ª',
    enunciado: 'Para la validez de la iniciativa navarra de incorporación al régimen autonómico vasco, la decisión del Órgano Foral debe ser ratificada por:',
    opciones: [
      'referéndum expresamente convocado al efecto y aprobado por mayoría de los votos válidos emitidos',
      'referéndum aprobado por mayoría absoluta de los electores',
      'las Cortes Generales por mayoría absoluta de cada Cámara',
      'el Consejo General Vasco por mayoría de dos tercios'
    ],
    explicacion: 'Disposición transitoria cuarta: debe ser «ratificada por referéndum expresamente convocado al efecto, y aprobado por mayoría de los votos válidos emitidos».'
  },
  {
    codigo: 'D. Transitoria 5.ª',
    enunciado: 'Ceuta y Melilla podrán constituirse en Comunidades Autónomas si así lo deciden sus Ayuntamientos y lo autorizan las Cortes Generales mediante:',
    opciones: [
      'acuerdo municipal por mayoría absoluta de sus miembros y ley orgánica, en los términos del artículo 144',
      'acuerdo municipal por mayoría de dos tercios y ley ordinaria',
      'acuerdo municipal por mayoría absoluta y referéndum de sus vecinos',
      'acuerdo municipal por mayoría simple y ley orgánica, en los términos del artículo 143'
    ],
    explicacion: 'Disposición transitoria quinta: acuerdo de los Ayuntamientos «por la mayoría absoluta de sus miembros» y autorización de las Cortes «mediante una ley orgánica, en los términos previstos en el artículo 144».'
  },
  {
    codigo: 'D. Transitoria 6.ª',
    enunciado: 'Cuando se remitan a la Comisión Constitucional del Congreso varios proyectos de Estatuto, se dictaminarán:',
    opciones: ['por el orden de entrada en aquélla', 'por orden de población de cada territorio', 'de forma simultánea y conjunta', 'por el orden que fije la Mesa del Congreso'],
    explicacion: 'Disposición transitoria sexta: «se dictaminarán por el orden de entrada en aquélla», y el plazo de dos meses del artículo 151 cuenta desde que la Comisión termina el estudio del proyecto anterior.'
  },
  {
    codigo: 'D. Transitoria 7.ª',
    enunciado: 'Un organismo provisional autonómico se considera disuelto si no hubiera ejercido el derecho que le reconoce la disposición transitoria primera en el plazo de:',
    opciones: ['tres años', 'dos años', 'cinco años', 'un año'],
    explicacion: 'Disposición transitoria séptima, letra c): «Si el organismo no hubiera ejercido el derecho que le reconoce la disposición transitoria primera en el plazo de tres años».'
  },
  {
    codigo: 'D. Transitoria 8.ª',
    enunciado: 'Las Cámaras que aprobaron la Constitución asumieron las funciones del Congreso y del Senado sin que su mandato pudiera extenderse más allá del:',
    opciones: ['15 de junio de 1981', '15 de junio de 1979', '29 de diciembre de 1982', '6 de diciembre de 1980'],
    explicacion: 'Disposición transitoria octava, apartado 1: «sin que en ningún caso su mandato se extienda más allá del 15 de junio de 1981».'
  },
  {
    codigo: 'D. Transitoria 8.ª',
    enunciado: 'A partir de la promulgación de la Constitución se abrió, para la aplicación del artículo 99 (investidura), un período de:',
    opciones: ['treinta días', 'quince días', 'dos meses', 'sesenta días'],
    explicacion: 'Disposición transitoria octava, apartado 2: «se abrirá un período de treinta días para la aplicación de lo dispuesto en dicho artículo».'
  },
  {
    codigo: 'D. Transitoria 9.ª',
    enunciado: 'A los tres años de la primera elección de los miembros del Tribunal Constitucional se procedió por sorteo a designar, para cesar y renovarse:',
    opciones: [
      'un grupo de cuatro miembros de la misma procedencia electiva',
      'un grupo de tres miembros de distinta procedencia electiva',
      'la mitad de sus miembros, elegidos por el Congreso',
      'un grupo de cuatro miembros designados por el Senado'
    ],
    explicacion: 'Disposición transitoria novena: «se procederá por sorteo para la designación de un grupo de cuatro miembros de la misma procedencia electiva que haya de cesar y renovarse».'
  },

  // ── Disposición derogatoria ──
  {
    codigo: 'D. Derogatoria',
    enunciado: 'Según la disposición derogatoria, queda derogada:',
    opciones: [
      'la Ley 1/1977, de 4 de enero, para la Reforma Política',
      'la Ley 1/1978, de 4 de enero, para la Reforma Política',
      'la Ley 46/1977, de 15 de octubre, de Amnistía',
      'la Ley 1/1977, de 4 de enero, de Referéndum Nacional'
    ],
    explicacion: 'Disposición derogatoria, apartado 1: «Queda derogada la Ley 1/1977, de 4 de enero, para la Reforma Política», junto con las Leyes Fundamentales del régimen anterior.'
  },
  {
    codigo: 'D. Derogatoria',
    enunciado: 'La disposición derogatoria considera definitivamente derogada la Ley de 25 de octubre de 1839 en lo que pudiera afectar a las provincias de:',
    opciones: ['Álava, Guipúzcoa y Vizcaya', 'Álava, Guipúzcoa, Vizcaya y Navarra', 'Navarra', 'Guipúzcoa y Vizcaya'],
    explicacion: 'Disposición derogatoria, apartado 2: «en lo que pudiera afectar a las provincias de Álava, Guipúzcoa y Vizcaya». Navarra no aparece.'
  },

  // ── Disposición final ──
  {
    codigo: 'D. Final',
    enunciado: 'Según la disposición final, la Constitución entró en vigor:',
    opciones: [
      'el mismo día de la publicación de su texto oficial en el Boletín Oficial del Estado',
      'a los veinte días de su publicación en el Boletín Oficial del Estado',
      'el día de su ratificación en referéndum',
      'el día de su sanción por el Rey ante las Cortes'
    ],
    explicacion: 'Disposición final: «Esta Constitución entrará en vigor el mismo día de la publicación de su texto oficial en el boletín oficial del Estado» (29 de diciembre de 1978). No hubo vacatio legis.'
  },
  {
    codigo: 'D. Final',
    enunciado: 'Según la disposición final, además de su texto oficial, la Constitución:',
    opciones: [
      'se publicará también en las demás lenguas de España',
      'podrá publicarse en las lenguas cooficiales si lo acuerdan las Comunidades Autónomas',
      'se traducirá a las lenguas oficiales en el plazo de un año',
      'solo se publicará en castellano'
    ],
    explicacion: 'Disposición final: «Se publicará también en las demás lenguas de España».'
  }
];
