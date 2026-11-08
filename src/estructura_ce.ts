export interface ItemEspecialMapaCE {
  codigo: string;
  titulo: string;
  concepto_clave: string;
  palabra_casillero: string;
  historia_mnemotecnica: string;
  texto_oficial: string;
}

export interface BloqueEstructuralCE {
  id_bloque: string;
  sigla: string;
  denominacion_oficial: string;
  rango_etiqueta: string;
  subestructura_resumen: string;
  rango_articulos?: [number, number];
  items_especiales?: ItemEspecialMapaCE[];
}

export const ESTRUCTURA_MAPA_CE: BloqueEstructuralCE[] = [
  {
    id_bloque: 'preambulo',
    sigla: 'PREÁMBULO',
    denominacion_oficial: 'Preámbulo de la Constitución Española',
    rango_etiqueta: 'Pórtico Solemne (Sanción Real 27-12-1978)',
    subestructura_resumen: 'Declaración solemne de la Nación española, valores de convivencia democrática, Estado de Derecho, derechos humanos, progreso cultural y relaciones pacíficas.',
    items_especiales: [
      {
        codigo: 'Preámbulo',
        titulo: 'Preámbulo de la Constitución Española',
        concepto_clave: 'Convivencia democrática y Estado de Derecho',
        palabra_casillero: 'Aro (0)',
        historia_mnemotecnica: 'La Nación española atraviesa un gigantesco ARO dorado luminoso que proclama justicia, libertad, seguridad y paz entre todos los pueblos de la Tierra antes de que las Cortes aprueben y el pueblo ratifique la Constitución.',
        texto_oficial: `La Nación española, deseando establecer la justicia, la libertad y la seguridad y promover el bien de cuantos la integran, en uso de su soberanía, proclama su voluntad de:
- Garantizar la convivencia democrática dentro de la Constitución y de las leyes conforme a un orden económico y social justo.
- Consolidar un Estado de Derecho que asegure el imperio de la ley como expresión de la voluntad popular.
- Proteger a todos los españoles y pueblos de España en el ejercicio de los derechos humanos, sus culturas y tradiciones, lenguas e instituciones.
- Promover el progreso de la cultura y de la economía para asegurar a todos una digna calidad de vida.
- Establecer una sociedad democrática avanzada, y
- Colaborar en el fortalecimiento de unas relaciones pacíficas y de eficaz cooperación entre todos los pueblos de la Tierra.
En consecuencia, las Cortes aprueban y el pueblo español ratifica la siguiente CONSTITUCIÓN.`
      }
    ]
  },
  {
    id_bloque: 'titulo_preliminar',
    sigla: 'TÍTULO PRELIMINAR',
    denominacion_oficial: 'Principios Generales y Valores Superiores del Estado',
    rango_etiqueta: 'Arts. 1 al 9',
    subestructura_resumen: 'Estado social y democrático de Derecho (Art. 1), unidad y autonomía (Art. 2), lenguas (Art. 3), bandera (Art. 4), capital (Art. 5), partidos y sindicatos (Arts. 6–7), Fuerzas Armadas (Art. 8) y sujeción y garantías jurídicas (Art. 9).',
    rango_articulos: [1, 9]
  },
  {
    id_bloque: 'titulo_i',
    sigla: 'TÍTULO I',
    denominacion_oficial: 'De los derechos y deberes fundamentales',
    rango_etiqueta: 'Arts. 10 al 55',
    subestructura_resumen: 'Art. 10 (Dignidad) · Cap. I: Españoles y extranjeros (Arts. 11–13) · Cap. II: Derechos y libertades [Art. 14 + Secc. 1.ª Arts. 15–29 + Secc. 2.ª Arts. 30–38] · Cap. III: Principios rectores (Arts. 39–52) · Cap. IV: Garantías y Defensor del Pueblo (Arts. 53–54) · Cap. V: Suspensión (Art. 55).',
    rango_articulos: [10, 55]
  },
  {
    id_bloque: 'titulo_ii',
    sigla: 'TÍTULO II',
    denominacion_oficial: 'De la Corona',
    rango_etiqueta: 'Arts. 56 al 65',
    subestructura_resumen: 'Jefatura del Estado, sucesión en el trono, Regencia, tutela del Rey menor, juramento, funciones constitucionales del Rey, refrendo de sus actos y Casa del Rey.',
    rango_articulos: [56, 65]
  },
  {
    id_bloque: 'titulo_iii',
    sigla: 'TÍTULO III',
    denominacion_oficial: 'De las Cortes Generales',
    rango_etiqueta: 'Arts. 66 al 96',
    subestructura_resumen: 'Cap. I: De las Cámaras — Congreso y Senado (Arts. 66–80) · Cap. II: De la elaboración de las leyes — Leyes orgánicas, decretos legislativos, decretos-leyes, iniciativa y sanción (Arts. 81–92) · Cap. III: De los Tratados Internacionales (Arts. 93–96).',
    rango_articulos: [66, 96]
  },
  {
    id_bloque: 'titulo_iv',
    sigla: 'TÍTULO IV',
    denominacion_oficial: 'Del Gobierno y de la Administración',
    rango_etiqueta: 'Arts. 97 al 107',
    subestructura_resumen: 'Funciones y composición del Gobierno, investidura del Presidente (Art. 99), cese, responsabilidad criminal, principios de la Administración Pública (Art. 103), Fuerzas y Cuerpos de Seguridad, control judicial y Consejo de Estado (Art. 107).',
    rango_articulos: [97, 107]
  },
  {
    id_bloque: 'titulo_v',
    sigla: 'TÍTULO V',
    denominacion_oficial: 'De las relaciones entre el Gobierno y las Cortes Generales',
    rango_etiqueta: 'Arts. 108 al 116',
    subestructura_resumen: 'Responsabilidad solidaria del Gobierno, información y presencia en las Cámaras, interpelaciones, cuestión de confianza (Art. 112), moción de censura (Art. 113), disolución de las Cámaras (Art. 115) y estados de alarma, excepción y sitio (Art. 116).',
    rango_articulos: [108, 116]
  },
  {
    id_bloque: 'titulo_vi',
    sigla: 'TÍTULO VI',
    denominacion_oficial: 'Del Poder Judicial',
    rango_etiqueta: 'Arts. 117 al 127',
    subestructura_resumen: 'Unidad jurisdiccional e independencia judicial, gratuidad de la justicia, publicidad y motivación de las sentencias, Consejo General del Poder Judicial (Art. 122), Tribunal Supremo (Art. 123), Ministerio Fiscal (Art. 124), jurado y policía judicial.',
    rango_articulos: [117, 127]
  },
  {
    id_bloque: 'titulo_vii',
    sigla: 'TÍTULO VII',
    denominacion_oficial: 'Economía y Hacienda',
    rango_etiqueta: 'Arts. 128 al 136',
    subestructura_resumen: 'Subordinación de la riqueza al interés general, participación en la Seguridad Social, planificación económica, potestad tributaria, Presupuestos Generales del Estado (Art. 134), estabilidad presupuestaria y Deuda Pública (Art. 135) y Tribunal de Cuentas (Art. 136).',
    rango_articulos: [128, 136]
  },
  {
    id_bloque: 'titulo_viii',
    sigla: 'TÍTULO VIII',
    denominacion_oficial: 'De la Organización Territorial del Estado',
    rango_etiqueta: 'Arts. 137 al 158',
    subestructura_resumen: 'Cap. I: Principios generales (Arts. 137–139) · Cap. II: De la Administración Local — Municipios y Provincias (Arts. 140–142) · Cap. III: De las Comunidades Autónomas — Vías de acceso, competencias Arts. 148–149, control Art. 155 y financiación (Arts. 143–158).',
    rango_articulos: [137, 158]
  },
  {
    id_bloque: 'titulo_ix',
    sigla: 'TÍTULO IX',
    denominacion_oficial: 'Del Tribunal Constitucional',
    rango_etiqueta: 'Arts. 159 al 165',
    subestructura_resumen: 'Composición de 12 miembros y mandato de 9 años (Art. 159), Presidencia (Art. 160), competencias de inconstitucionalidad, amparo y conflictos (Art. 161), legitimación activa (Art. 162), cuestión de inconstitucionalidad (Art. 163) y efectos de las sentencias (Art. 164).',
    rango_articulos: [159, 165]
  },
  {
    id_bloque: 'titulo_x',
    sigla: 'TÍTULO X',
    denominacion_oficial: 'De la reforma constitucional',
    rango_etiqueta: 'Arts. 166 al 169',
    subestructura_resumen: 'Iniciativa de reforma constitucional (Art. 166), procedimiento ordinario de reforma por mayoría de 3/5 (Art. 167), procedimiento agravado por mayoría de 2/3, disolución y referéndum obligatorio (Art. 168) y límites temporales a la reforma (Art. 169).',
    rango_articulos: [166, 169]
  },
  {
    id_bloque: 'disposiciones',
    sigla: 'DISPOSICIONES',
    denominacion_oficial: 'Disposiciones Adicionales (4), Transitorias (9), Derogatoria (1) y Final (1)',
    rango_etiqueta: '15 Disposiciones Oficiales',
    subestructura_resumen: '4 Disposiciones Adicionales (derechos forales y régimen canario), 9 Disposiciones Transitorias (procesos autonómicos, Navarra, Ceuta y Melilla, Cortes y TC), 1 Disposición Derogatoria y 1 Disposición Final (entrada en vigor inmediata).',
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
        historia_mnemotecnica: 'Del volcán Teide sale HUMO amarillo con un informe previo obligatorio antes de tocar el régimen económico y fiscal canario.',
        texto_oficial: 'La modificación del régimen económico y fiscal del archipiélago canario requerirá informe previo de la Comunidad Autónoma o, en su caso, del órgano provisional autonómico.'
      },
      {
        codigo: 'D. Adicional 4.ª',
        titulo: 'Disposición adicional cuarta',
        concepto_clave: 'Sedes de Audiencias Territoriales',
        palabra_casillero: 'Oca (4)',
        historia_mnemotecnica: 'Una OCA con toga judicial reparte competencias entre varias Audiencias Territoriales bajo la Ley Orgánica del Poder Judicial.',
        texto_oficial: 'En las Comunidades Autonomas donde tengan su sede más de una Audiencia Territorial, los Estatutos de Autonomía respectivos podrán mantener las existentes, distribuyendo las competencias entre ellas, siempre de conformidad con lo previsto en la ley orgánica del poder judicial y dentro de la unidad e independencia de éste.'
      },
      {
        codigo: 'D. Transitoria 1.ª',
        titulo: 'Disposición transitoria primera',
        concepto_clave: 'Sustitución de iniciativa autonómica provincial',
        palabra_casillero: 'Té (1)',
        historia_mnemotecnica: 'Los órganos preautonómicos brindan con tazas de TÉ por mayoría absoluta para sustituir la iniciativa de las Diputaciones.',
        texto_oficial: 'En los territorios dotados de un régimen provisional de autonomía, sus órganos colegiados superiores, mediante acuerdo adoptado por la mayoría absoluta de sus miembros, podrán sustituir la iniciativa que en el apartado 2 del artículo 143 atribuye a las Diputaciones Provinciales o a los órganos interinsulares correspondientes.'
      },
      {
        codigo: 'D. Transitoria 2.ª',
        titulo: 'Disposición transitoria segunda',
        concepto_clave: 'Territorios con Estatutos plebiscitados en el pasado',
        palabra_casillero: 'Noé (2)',
        historia_mnemotecnica: 'NOÉ desembarca con antiguos Estatutos plebiscitados para acceder directamente al techo competencial del artículo 151.',
        texto_oficial: 'Los territorios que en el pasado hubiesen plebiscitado afirmativamente proyectos de Estatuto de autonomía y cuenten, al tiempo de promulgarse esta Constitución, con regímenes provisionales de autonomía podrán proceder inmediatamente en la forma que se prevé en el apartado 2 del artículo 148, cuando así lo acordaren, por mayoría absoluta, sus órganos preautonómicos colegiados superiores, comunicándolo al Gobierno. El proyecto de Estatuto será elaborado de acuerdo con lo establecido en el artículo 151, número 2, a convocatoria del órgano colegiado preautonómico.'
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
        historia_mnemotecnica: 'Una OCA con pañuelo rojo de San Fermín vota en el Órgano Foral competente y convoca referéndum en Navarra.',
        texto_oficial: '1. En el caso de Navarra, y a efectos de su incorporación al Consejo General Vasco o al régimen autonómico vasco que le sustituya, en lugar de lo que establece el artículo 143 de la Constitución, la iniciativa corresponde al Órgano Foral competente, el cual adoptará su decisión por mayoría de los miembros que lo componen. Para la validez de dicha iniciativa será preciso, además, que la decisión del Órgano Foral competente sea ratificada por referéndum expresamente convocado al efecto, y aprobado por mayoría de los votos válidos emitidos.\n2. Si la iniciativa no prosperase, solamente se podrá reproducir la misma en distinto período del mandato del Órgano Foral competente, y en todo caso, cuando haya transcurrido el plazo mínimo que establece el artículo 143.'
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
        texto_oficial: 'Los organismos provisionales autonómicos se considerarán disueltos en los siguientes casos:\na) Una vez constituidos los órganos que establezcan los Estatutos de Autonomía aprobados conforme a esta Constitución.\nb) En el supuesto de que la iniciativa del proceso autonómico no llegara a prosperar por no cumplir los requisitos previstos en el artículo 143.\nc) Si el organismo no hubiera ejercido el derecho que le reconoce la disposición transitoria primera en el plazo de tres años.'
      },
      {
        codigo: 'D. Transitoria 8.ª',
        titulo: 'Disposición transitoria octava',
        concepto_clave: 'Cámaras constituyentes y Presidencia del Gobierno',
        palabra_casillero: 'Hacha (8)',
        historia_mnemotecnica: 'Un HACHA corta el calendario el 15 de junio de 1981 y abre un plazo de 30 días para aplicar el artículo 99.',
        texto_oficial: '1. Las Cámaras que han aprobado la presente Constitución asumirán, tras la entrada en vigor de la misma, las funciones y competencias que en ella se señalan, respectivamente, para el Congreso y el Senado, sin que en ningún caso su mandato se extienda más allá del 15 de junio de 1981.\n2. A los efectos de lo establecido en el artículo 99, la promulgación de la Constitución se considerará como supuesto constitucional en el que procede su aplicación. A tal efecto, a partir de la citada promulgación se abrirá un período de treinta días para la aplicación de lo dispuesto en dicho artículo.'
      },
      {
        codigo: 'D. Transitoria 9.ª',
        titulo: 'Disposición transitoria novena',
        concepto_clave: 'Primera renovación por sorteo del Tribunal Constitucional',
        palabra_casillero: 'Oveja (9)',
        historia_mnemotecnica: 'Una OVEJA saca bolas de un bombo de lotería a los 3 y 6 años para renovar por tercios a los primeros magistrados del TC.',
        texto_oficial: 'A los tres años de la elección por vez primera de los miembros del Tribunal Constitucional se procederá por sorteo para la designación de un grupo de cuatro miembros de la misma procedencia electiva que haya de cesar y renovarse. A estos solos efectos se entenderán agrupados como miembros de la misma procedencia a los dos designados a propuesta del Gobierno y a los dos que proceden de la formulada por el Consejo General del Poder Judicial. Del mismo modo se procederá transcurridos otros tres años entre los dos grupos no afectados por el sorteo anterior. A partir de entonces se estará a lo establecido en el número 3 del artículo 159.'
      },
      {
        codigo: 'D. Derogatoria',
        titulo: 'Disposición derogatoria',
        concepto_clave: 'Derogación de Leyes Fundacionales y leyes de 1839/1876',
        palabra_casillero: 'Toro (10)',
        historia_mnemotecnica: 'Un TORO embiste y deroga la Ley para la Reforma Política de 1977, las siete Leyes Fundamentales y las leyes de 1839 y 1876.',
        texto_oficial: '1. Queda derogada la Ley 1/1977, de 4 de enero, para la Reforma Política, así como, en tanto en cuanto no estuvieran ya derogadas por la anteriormente mencionada Ley, la de Principios del Movimiento Nacional, de 17 de mayo de 1958; el Fuero de los Españoles, de 17 de julio de 1945; el del Trabajo, de 9 de marzo de 1938; la Ley Constitutiva de las Cortes, de 17 de julio de 1942; la Ley de Sucesión en la Jefatura del Estado, de 26 de julio de 1947, todas ellas modificadas por la Ley Orgánica del Estado, de 10 de enero de 1967, y en los mismos términos esta última y la de Referéndum Nacional de 22 de octubre de 1945.\n2. En tanto en cuanto pudiera conservar alguna vigencia, se considera definitivamente derogada la Ley de 25 de octubre de 1839 en lo que pudiera afectar a las provincias de Álava, Guipúzcoa y Vizcaya. En los mismos términos se considera definitivamente derogada la Ley de 21 de julio de 1876.\n3. Asimismo quedan derogadas cuantas disposiciones se opongan a lo establecido en esta Constitución.'
      },
      {
        codigo: 'D. Final',
        titulo: 'Disposición final',
        concepto_clave: 'Entrada en vigor el mismo día de su publicación en el BOE',
        palabra_casillero: 'Dado (11)',
        historia_mnemotecnica: 'Un DADO gigante cae sobre el BOE el 29 de diciembre de 1978 haciendo que la Constitución entre en vigor el mismo día de su publicación (sin vacatio legis).',
        texto_oficial: 'Esta Constitución entrará en vigor el mismo día de la publicación de su texto oficial en el boletín oficial del Estado. Se publicará también en las demás lenguas de España.'
      }
    ]
  }
];
