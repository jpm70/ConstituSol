import { ApartadoCE } from './build_datos_ce';

export interface TestTrampa {
  enunciado: string;
  opciones: [string, string, string, string];
  indice_correcta: number;
  trampa_explicacion: string;
}

/**
 * Diccionario de preguntas trampa específicas de alta frecuencia en exámenes oficiales
 * (AGE, Administración Local, Justicia, CCAA, Fuerzas y Cuerpos de Seguridad).
 * En todas ellas `indice_correcta` es 1 (la Opción B en el esquema base, que luego
 * el Modo Cazador de Trampas mezcla aleatoriamente en pantalla).
 */
const TRAMPAS_ESPECIFICAS: Record<number, TestTrampa> = {
  1: {
    enunciado: 'Según el artículo 1.1 de la Constitución Española, ¿cuáles son los valores superiores del ordenamiento jurídico que propugna España?',
    opciones: [
      'La libertad, la justicia, la igualdad y la solidaridad territorial.',
      'La libertad, la justicia, la igualdad y el pluralismo político.',
      'La legalidad, la jerarquía normativa, la igualdad y el pluralismo político.',
      'La soberanía nacional, la justicia, la igualdad y la dignidad de la persona.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: el tribunal suele infiltrar "solidaridad" (art. 2), "dignidad" (art. 10) o "jerarquía normativa" (art. 9.3). Los 4 valores superiores del art. 1.1 son exclusivamente: libertad, justicia, igualdad y pluralismo político.'
  },
  2: {
    enunciado: 'Conforme al artículo 2 de la Constitución Española, la Constitución se fundamenta en:',
    opciones: [
      'La soberanía compartida de los pueblos de España y la solidaridad entre todas sus regiones.',
      'La indisoluble unidad de la Nación española, patria común e indivisible de todos los españoles.',
      'El derecho de autodeterminación de las nacionalidades históricas previa ley orgánica.',
      'La federación solidaria de las Comunidades Autónomas y municipios que la integran.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa clásica: distinguir qué "fundamenta" la CE (la indisoluble unidad de la Nación española) frente a qué "reconoce y garantiza" (el derecho a la autonomía de las nacionalidades y regiones y la solidaridad entre todas ellas).'
  },
  3: {
    enunciado: 'De acuerdo con el artículo 3 de la Constitución, respecto al castellano y las demás lenguas españolas:',
    opciones: [
      'Todos los españoles tienen el deber de conocer y usar todas las lenguas oficiales del Estado.',
      'Todos los españoles tienen el deber de conocer el castellano y el derecho a usarlo, siendo las demás lenguas oficiales en sus respectivas Comunidades Autónomas según sus Estatutos.',
      'Todos los españoles tienen el derecho de conocer el castellano y el deber de usarlo en las relaciones con el Gobierno.',
      'Las demás lenguas españolas serán oficiales en todo el territorio nacional cuando así lo acuerde el Senado por mayoría absoluta.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo al cruce de verbos que hace siempre el tribunal: respecto al castellano existe el DEBER de conocerlo y el DERECHO a usarlo (no el derecho a conocerlo y el deber de usarlo).'
  },
  4: {
    enunciado: 'Según el artículo 4.1 de la Constitución Española, ¿qué proporción tienen las franjas horizontales de la bandera de España?',
    opciones: [
      'Tres franjas horizontales de igual anchura: roja, amarilla y roja.',
      'Tres franjas horizontales, roja, amarilla y roja, siendo la amarilla de doble anchura que cada una de las rojas.',
      'Tres franjas horizontales, amarilla, roja y amarilla, siendo la roja central de doble anchura.',
      'Tres franjas horizontales de proporción regulada por ley orgánica de las Cortes Generales.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa habitual de examen: las tres franjas NO son de igual anchura; la franja amarilla es de DOBLE anchura que cada una de las rojas.'
  },
  5: {
    enunciado: 'Según el artículo 5 de la Constitución Española, la capital del Estado es:',
    opciones: [
      'La ciudad de Madrid.',
      'La villa de Madrid.',
      'El municipio metropolitano de Madrid, fijado por ley ordinaria.',
      'La Comunidad Autónoma de Madrid, previa aprobación de las Cortes Generales.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Detalle literal clásico de oposición: el artículo 5 dice textualmente "La capital del Estado es la VILLA de Madrid", no "la ciudad de Madrid" ni "el municipio de Madrid".'
  },
  6: {
    enunciado: 'Según el artículo 6 de la Constitución, la estructura interna y el funcionamiento de los partidos políticos:',
    opciones: [
      'Son libres dentro del respeto a los Estatutos de cada partido.',
      'Deberán ser democráticos, siendo libres su creación y el ejercicio de su actividad dentro del respeto a la Constitución y a la ley.',
      'Serán regulados mediante real decreto del Consejo de Ministros previa autorización judicial.',
      'Requerirán aprobación previa del Congreso de los Diputados por mayoría simple.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: su creación y el ejercicio de su actividad son LIBRES (dentro del respeto a la CE y a la ley), pero su estructura interna y funcionamiento DEBERÁN ser democráticos.'
  },
  8: {
    enunciado: 'Conforme al artículo 8 de la Constitución Española, ¿quiénes integran las Fuerzas Armadas y cómo se regulan las bases de la organización militar?',
    opciones: [
      'El Ejército de Tierra, la Armada, el Ejército del Aire y la Guardia Civil, regulados por ley ordinaria.',
      'El Ejército de Tierra, la Armada y el Ejército del Aire, regulándose las bases de la organización militar por ley orgánica.',
      'Las Fuerzas y Cuerpos de Seguridad del Estado y los tres Ejércitos, mediante real decreto-ley.',
      'Los tres Ejércitos bajo el mando exclusivo del Ministro de Defensa sin reserva de ley orgánica.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Doble trampa frecuente: 1) Las Fuerzas Armadas se componen únicamente de Ejército de Tierra, Armada y Ejército del Aire; 2) Las bases de la organización militar se regulan por LEY ORGÁNICA (art. 8.2).'
  },
  9: {
    enunciado: 'Según el artículo 9.3 de la Constitución, ¿cuál de los siguientes principios está expresamente garantizado por la Constitución?',
    opciones: [
      'La retroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales.',
      'La irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales.',
      'La retroactividad de todas las leyes orgánicas aprobadas por mayoría absoluta.',
      'La arbitrariedad discrecional de los poderes públicos por razones de urgencia.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo a la formulación del art. 9.3: garantiza la IRRETROACTIVIDAD de las disposiciones sancionadoras NO favorables o restrictivas de derechos individuales (lo que permite a sensu contrario la retroactividad de las favorables).'
  },
  11: {
    enunciado: 'Según el artículo 11.2 de la Constitución Española, respecto a la pérdida de la nacionalidad:',
    opciones: [
      'Ningún español, sea de origen o nacionalizado, podrá ser privado de su nacionalidad.',
      'Ningún español de origen podrá ser privado de su nacionalidad.',
      'Cualquier español de origen podrá ser privado de su nacionalidad por resolución gubernativa en plazo de 30 días.',
      'Solo el Tribunal Constitucional puede privar de la nacionalidad a un español de origen.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa muy repetida: la prohibición absoluta de privación de nacionalidad protege únicamente al español "DE ORIGEN" ("Ningún español de origen podrá ser privado de su nacionalidad"), no a todo español.'
  },
  13: {
    enunciado: 'De acuerdo con el artículo 13.2 de la Constitución (reformado en 1992), en las elecciones municipales, los extranjeros residentes en España:',
    opciones: [
      'Solo tienen derecho de sufragio activo, nunca pasivo, salvo reforma por el artículo 168.',
      'Pueden gozar del derecho de sufragio activo y pasivo en las elecciones municipales, atendiendo a criterios de reciprocidad, por tratado o ley.',
      'Gozan de sufragio activo y pasivo tanto en elecciones municipales como en elecciones a las Cortes Generales.',
      'Necesitan autorización individual del Consejo de Ministros en el plazo de 15 días.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: la primera reforma constitucional (1992) añadió las palabras "Y PASIVO" en el art. 13.2, pero circunscrito exclusivamente a las elecciones MUNICIPALES y bajo criterios de reciprocidad.'
  },
  15: {
    enunciado: 'Según el artículo 15 de la Constitución Española, respecto a la pena de muerte:',
    opciones: [
      'Queda abolida en todo caso y sin ninguna excepción posible en el texto constitucional.',
      'Queda abolida, salvo lo que puedan disponer las leyes penales militares para tiempos de guerra.',
      'Puede aplicarse durante el estado de sitio previa mayoría de dos tercios del Congreso.',
      'Solo puede ser impuesta por la Sala Segunda del Tribunal Supremo en delitos de traición.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa clásica: aunque la LO 11/1995 abolió la pena de muerte también en el ámbito militar, el texto literal del artículo 15 de la CE mantiene la salvedad: "salvo lo que puedan disponer las leyes penales militares para tiempos de guerra".'
  },
  16: {
    enunciado: 'Según el artículo 16.1 de la Constitución, la libertad ideológica, religiosa y de culto tiene como única limitación en sus manifestaciones:',
    opciones: [
      'El respeto a la moral pública y a las costumbres tradicionales.',
      'La necesaria para el mantenimiento del orden público protegido por la ley.',
      'La autorización previa de la autoridad gubernativa con 72 horas de antelación.',
      'El informe vinculante del Ministerio de Justicia y de las confesiones inscritas.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: el art. 16.1 señala literalmente "sin más limitación, en sus manifestaciones, que la necesaria para el mantenimiento del ORDEN PÚBLICO protegido por la ley".'
  },
  17: {
    enunciado: 'Según el artículo 17.2 de la Constitución Española, ¿cuál es el plazo máximo absoluto de la detención preventiva?',
    opciones: [
      'No podrá durar más de 48 horas en ningún supuesto.',
      'No podrá durar más del tiempo estrictamente necesario para la realización de las averiguaciones tendentes al esclarecimiento de los hechos y, en todo caso, en el plazo máximo de 72 horas.',
      'Durará siempre un mínimo obligatorio de 72 horas prorrogables por otras 72 horas por la policía.',
      'Un plazo máximo de 24 horas salvo autorización del Ministerio Fiscal.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Doble trampa de examen: 1) El plazo máximo constitucional son 72 HORAS (no 48 ni 24); 2) No es un plazo fijo sino un tope máximo ("no podrá durar más del tiempo estrictamente necesario... y, en todo caso, en el plazo máximo de 72 horas").'
  },
  18: {
    enunciado: 'Según el artículo 18.2 de la Constitución, ¿en qué supuestos se puede entrar o registrar un domicilio sin consentimiento del titular?',
    opciones: [
      'Por orden motivada de la autoridad gubernativa o policial en caso de sospecha grave.',
      'Con resolución judicial, salvo en caso de flagrante delito.',
      'Previa autorización del Ministerio Fiscal en un plazo máximo de 48 horas.',
      'Únicamente mediante ley orgánica aprobada por mayoría absoluta del Senado.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: fuera del consentimiento del titular, la CE solo permite la entrada o registro por RESOLUCIÓN JUDICIAL o en caso de FLAGRANTE DELITO (nunca por mera orden policial o del Fiscal).'
  },
  21: {
    enunciado: 'Según el artículo 21 de la Constitución Española, el ejercicio del derecho de reunión pacífica y sin armas:',
    opciones: [
      'Necesitará autorización previa de la Delegación del Gobierno en todo caso.',
      'No necesitará autorización previa; en los casos de reuniones en lugares de tránsito público y manifestaciones se dará comunicación previa a la autoridad.',
      'Requerirá autorización previa con 10 días de antelación cuando se celebre en lugares cerrados.',
      'Solo podrá ser prohibido por el Tribunal Constitucional por mayoría de tres quintos.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa estrella de oposiciones: el derecho de reunión NUNCA requiere "autorización previa". En lugares de tránsito público y manifestaciones solo exige "COMUNICACIÓN previa" a la autoridad.'
  },
  54: {
    enunciado: 'Según el artículo 54 de la Constitución Española, el Defensor del Pueblo es el alto comisionado:',
    opciones: [
      'Del Gobierno de la Nación, designado por el Consejo de Ministros para la defensa de la legalidad.',
      'De las Cortes Generales, designado por estas para la defensa de los derechos comprendidos en el Título I, a cuyo efecto podrá supervisar la actividad de la Administración.',
      'Del Poder Judicial, nombrado por el Consejo General del Poder Judicial por mayoría simple.',
      'Del Congreso de los Diputados exclusivamente, con mandato de tres años.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo con el órgano competente: el Defensor del Pueblo es alto comisionado de las CORTES GENERALES (no del Gobierno ni solo del Congreso) para la defensa de los derechos del Título I, y se regula por ley orgánica.'
  },
  56: {
    enunciado: 'Conforme al artículo 56.3 de la Constitución, los actos del Rey estarán siempre refrendados en la forma establecida en el artículo 64, careciendo de validez sin dicho refrendo, salvo:',
    opciones: [
      'Tanto el nombramiento de los miembros de su Casa como la propuesta de candidato a Presidente del Gobierno.',
      'Lo dispuesto en el artículo 65.2 (el nombramiento y relevo libre de los miembros civiles y militares de su Casa).',
      'La sanción y promulgación de las leyes orgánicas en el plazo de 15 días.',
      'La declaración de los estados de alarma, excepción y sitio a propuesta del Senado.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: la única excepción constitucional al refrendo mencionada en el art. 56.3 es lo dispuesto en el artículo 65.2 (nombrar y relevar libremente a los miembros civiles y militares de su Casa).'
  },
  68: {
    enunciado: 'Según el artículo 68 de la Constitución Española, el Congreso se compone de:',
    opciones: [
      'Un número fijo de 350 Diputados, celebrándose las elecciones entre los 15 y 30 días desde la terminación del mandato.',
      'Un mínimo de 300 y un máximo de 400 Diputados, teniendo lugar las elecciones entre los treinta días y sesenta días desde la terminación del mandato.',
      'Un mínimo de 250 y un máximo de 350 Diputados, siendo el Congreso electo convocado dentro de los 45 días siguientes.',
      'Cuatro Diputados por provincia elegidos por sistema mayoritario por el Senado.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Doble trampa clásica: 1) La CE fija una horquilla de "mínimo 300 y máximo 400 Diputados" (es la LOREG la que fija 350); 2) Las elecciones son entre los 30 y 60 días desde el fin del mandato, y la convocatoria dentro de los 25 días siguientes.'
  },
  81: {
    enunciado: 'Según el artículo 81.2 de la Constitución, la aprobación, modificación o derogación de las leyes orgánicas exigirá:',
    opciones: [
      'Mayoría absoluta del Congreso y del Senado en una votación parcial por artículos.',
      'Mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto.',
      'Mayoría de tres quintos del Congreso de los Diputados en primera votación.',
      'Mayoría simple del Congreso y refrendo previo del Tribunal Constitucional.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo: el artículo 81.2 exige MAYORÍA ABSOLUTA del CONGRESO (no del Senado ni de ambas Cámaras) y específicamente "en una votación final sobre el conjunto del proyecto".'
  },
  86: {
    enunciado: 'Según el artículo 86 de la Constitución, los Decretos-leyes deberán ser inmediatamente sometidos a debate y votación de totalidad:',
    opciones: [
      'En ambas Cámaras de las Cortes Generales en el plazo de los veinte días siguientes a su promulgación.',
      'Al Congreso de los Diputados, convocado al efecto si no estuviere reunido, en el plazo de los treinta días siguientes a su promulgación.',
      'Al Senado en el plazo máximo de quince días hábiles desde su publicación.',
      'Al Consejo de Estado en el plazo de diez días naturales.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa doble de órgano y plazo: los Decretos-leyes los convalida o deroga únicamente el CONGRESO DE LOS DIPUTADOS (no el Senado) y en el plazo de los TREINTA DÍAS siguientes a su promulgación.'
  },
  90: {
    enunciado: 'Según el artículo 90 de la Constitución, ¿de qué plazo dispone el Senado para oponer su veto o introducir enmiendas a un proyecto de ley ordinario u orgánico?',
    opciones: [
      'Dos meses en todos los casos, sin reducción posible en los proyectos urgentes.',
      'Dos meses a partir del día de la recepción del texto, plazo que se reducirá al de veinte días naturales en los proyectos declarados urgentes por el Gobierno o por el Congreso.',
      'Treinta días hábiles ordinarios, reducidos a diez días hábiles si lo declara urgente el Senado.',
      'Quince días naturales, requiriendo mayoría simple para aprobar el veto.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo a los plazos y órganos del art. 90: el plazo ordinario es de 2 MESES, pero se reduce a 20 DÍAS NATURALES en proyectos declarados urgentes por el Gobierno o por el Congreso (no por el propio Senado).'
  },
  91: {
    enunciado: 'Conforme al artículo 91 de la Constitución Española, el Rey sancionará las leyes aprobadas por las Cortes Generales en el plazo de:',
    opciones: [
      'Diez días hábiles, pudiendo devolverlas a las Cortes con veto suspensivo.',
      'Quince días, y las promulgará y ordenará su inmediata publicación.',
      'Veinte días naturales, previo dictamen favorable del Consejo de Ministros.',
      'Treinta días desde su aprobación definitiva por el Senado.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo al plazo exacto del artículo 91: el Rey sancionará las leyes en el plazo de QUINCE DÍAS (15 días), las promulgará y ordenará su inmediata publicación.'
  },
  99: {
    enunciado: 'Según el artículo 99 de la Constitución, en la investidura del Presidente del Gobierno, ¿qué mayoría se requiere y desde cuándo corre el plazo de dos meses para la disolución de las Cámaras?',
    opciones: [
      'Mayoría de tres quintos en primera votación, corriendo los dos meses desde la celebración de las elecciones.',
      'Mayoría absoluta del Congreso en primera votación (o simple 48 horas después), corriendo el plazo de dos meses a partir de la primera votación de investidura.',
      'Mayoría absoluta de Congreso y Senado conjuntamente, corriendo el plazo desde la propuesta del Rey.',
      'Mayoría simple en primera votación y absoluta 72 horas después.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa clásica de examen: 1) La segunda votación se celebra 48 HORAS después (no 72) y basta mayoría SIMPLE; 2) El plazo de DOS MESES del art. 99.5 empieza a contar "a partir de la PRIMERA VOTACIÓN de investidura".'
  },
  112: {
    enunciado: 'Según el artículo 112 de la Constitución Española, la cuestión de confianza la plantea el Presidente del Gobierno:',
    opciones: [
      'Previa autorización vinculante del Consejo de Ministros, entendiéndose otorgada por mayoría absoluta.',
      'Previa deliberación del Consejo de Ministros, ante el Congreso de los Diputados, y la confianza se entenderá otorgada cuando vote a favor la mayoría simple de los Diputados.',
      'Ante el Pleno del Senado sobre una ley orgánica, requiriendo mayoría de tres quintos.',
      'Solicitando la firma de al menos la décima parte de los Diputados.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo a la diferencia entre cuestión de confianza (art. 112) y moción de censura (art. 113): la cuestión de confianza exige previa DELIBERACIÓN (no acuerdo vinculante) del Consejo de Ministros y se gana por MAYORÍA SIMPLE.'
  },
  113: {
    enunciado: 'De acuerdo con el artículo 113 de la Constitución, la moción de censura:',
    opciones: [
      'Deberá ser propuesta por una quinta parte de los Diputados y se aprueba por mayoría simple tras 48 horas.',
      'Deberá ser propuesta al menos por la décima parte de los Diputados, habiendo de incluir un candidato a la Presidencia del Gobierno, exige mayoría absoluta y no podrá ser votada hasta que transcurran cinco días desde su presentación.',
      'Puede presentarse en el Senado por 50 Senadores y votarse en el plazo de tres días.',
      'Impide a sus signatarios presentar otra moción durante toda la legislatura.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Cuádruple cifra clave del art. 113: 1) Propuesta por al menos 1/10 (décima parte) de los Diputados; 2) Mayoría ABSOLUTA del Congreso; 3) Enfriamiento de 5 DÍAS desde su presentación; 4) Moción alternativa en los 2 primeros días; 5) Si falla, no pueden firmar otra en el MISMO PERIODO DE SESIONES (no en toda la legislatura).'
  },
  116: {
    enunciado: 'Según el artículo 116 de la Constitución Española, ¿quién declara el estado de alarma y por qué plazo máximo inicial?',
    opciones: [
      'El Congreso de los Diputados por mayoría absoluta, por un plazo máximo de treinta días.',
      'El Gobierno mediante decreto acordado en Consejo de Ministros por un plazo máximo de quince días, dando cuenta al Congreso de los Diputados, sin cuya autorización no podrá ser prorrogado.',
      'El Rey a propuesta del Presidente del Congreso, por un plazo de veinte días naturales.',
      'El Senado por mayoría absoluta, previa solicitud de las Comunidades Autónomas.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'No confundas los tres estados del art. 116: 1) Alarma: lo declara el GOBIERNO por máx. 15 días (prórroga autorizada por el Congreso); 2) Excepción: lo declara el Gobierno previa autorización del Congreso (máx. 30 días prorrogables otros 30); 3) Sitio: lo declara la mayoría absoluta del CONGRESO a propuesta exclusiva del Gobierno.'
  },
  122: {
    enunciado: 'Conforme al artículo 122.3 de la Constitución Española, el Consejo General del Poder Judicial estará integrado por:',
    opciones: [
      'El Presidente del Tribunal Constitucional y doce vocales nombrados por el Gobierno por tres años.',
      'El Presidente del Tribunal Supremo, que lo presidirá, y por veinte miembros nombrados por el Rey por un periodo de cinco años.',
      'Quince Magistrados elegidos por mayoría simple de las Cortes Generales por nueve años.',
      'Veinticuatro miembros vitalicios designados por el Ministerio de Justicia.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Cifras exactas del art. 122.3: Presidente del Tribunal Supremo + 20 miembros nombrados por el Rey por un periodo de 5 AÑOS (12 entre Jueces y Magistrados; 4 a propuesta del Congreso y 4 del Senado por mayoría de 3/5).'
  },
  155: {
    enunciado: 'Según el artículo 155.1 de la Constitución Española, para obligar a una Comunidad Autónoma al cumplimiento forzoso de sus obligaciones constitucionales, el Gobierno necesita:',
    opciones: [
      'Requerimiento previo al Presidente de la Comunidad Autónoma y, en el caso de no ser atendido, la aprobación por mayoría absoluta del Congreso de los Diputados.',
      'Previo requerimiento al Presidente de la Comunidad Autónoma y, en el caso de no ser atendido, la aprobación por mayoría absoluta del Senado.',
      'Dictamen vinculante del Tribunal Constitucional y mayoría de tres quintos de ambas Cámaras.',
      'Autorización directa del Rey mediante real decreto-ley sin requerimiento previo.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa clásica de órgano competente: el artículo 155 es de las pocas funciones constitucionales donde decide en exclusiva el SENADO por MAYORÍA ABSOLUTA (no el Congreso), y siempre tras el "previo requerimiento al Presidente de la Comunidad Autónoma".'
  },
  159: {
    enunciado: 'Según el artículo 159 de la Constitución Española, el Tribunal Constitucional se compone de:',
    opciones: [
      'Veinte miembros nombrados por cinco años: diez por el Congreso y diez por el Senado.',
      'Doce miembros nombrados por el Rey; de ellos, cuatro a propuesta del Congreso por mayoría de 3/5, cuatro a propuesta del Senado por idéntica mayoría, dos a propuesta del Gobierno y dos a propuesta del CGPJ, por un período de nueve años.',
      'Quince miembros nombrados por seis años y renovados por mitades cada tres años.',
      'Doce miembros elegidos en su totalidad por las Cortes Generales por mayoría absoluta.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'No confundas CGPJ (20 vocales por 5 años) con el Tribunal Constitucional (12 miembros nombrados por 9 años y renovados por terceras partes cada 3 años: 4 Congreso, 4 Senado, 2 Gobierno, 2 CGPJ).'
  },
  167: {
    enunciado: 'Según el artículo 167 de la Constitución, los proyectos de reforma constitucional ordinaria deberán ser aprobados por:',
    opciones: [
      'Mayoría absoluta de cada una de las Cámaras y referéndum obligatorio en todo caso.',
      'Una mayoría de tres quintos de cada una de las Cámaras, sometiéndose a referéndum cuando así lo soliciten, dentro de los quince días siguientes a su aprobación, una décima parte de los miembros de cualquiera de las Cámaras.',
      'Mayoría de dos tercios del Congreso y disolución inmediata de las Cortes Generales.',
      'Mayoría simple del Congreso y absoluta del Senado en plazo de treinta días.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Ojo a la diferencia entre art. 167 y art. 168: en el art. 167 la mayoría inicial es de 3/5 (tres quintos) de cada Cámara, y el referéndum es FACULTATIVO (solo si lo pide 1/10 de cualquiera de las Cámaras dentro de los 15 días siguientes).'
  },
  168: {
    enunciado: 'Conforme al artículo 168 de la Constitución Española, ¿cuándo procede el procedimiento agravado de reforma (mayoría de dos tercios, disolución de Cortes y referéndum obligatorio)?',
    opciones: [
      'Cuando se proponga la reforma de cualquier artículo del Título I o del Título VIII.',
      'Cuando se proponga la revisión total de la Constitución o una parcial que afecte al Título Preliminar, al Capítulo segundo, Sección primera del Título I, o al Título II.',
      'Únicamente cuando se proponga modificar la Corona (Título II) o el Tribunal Constitucional (Título IX).',
      'Cuando lo solicite el Gobierno por decreto-ley o una quinta parte de los Senadores.'
    ],
    indice_correcta: 1,
    trampa_explicacion: 'Trampa decisiva de oposición: el art. 168 NO protege todo el Título I, sino exclusivamente el "Capítulo segundo, Sección primera del Título I" (arts. 15 a 29), además de la revisión total, el Título Preliminar (arts. 1 a 9) y el Título II (La Corona, arts. 56 a 65).'
  }
};

/**
 * Construye una pregunta `test_trampa` rigurosa para cualquier artículo de la CE
 * utilizando o bien la trampa específica de alta frecuencia o bien el análisis
 * directo del texto oficial del BOE de ese artículo (plazos, mayorías, órganos y literalidad).
 */
export function buildTestTrampaForArticle(
  id: number,
  temaGeneral: string,
  palabraCasillero: string,
  textoOficial: string,
  apartados: ApartadoCE[]
): TestTrampa {
  // Normalizar índice correcta = 1 en las específicas (o respetar el definido)
  if (TRAMPAS_ESPECIFICAS[id]) {
    return TRAMPAS_ESPECIFICAS[id];
  }

  const primerApartado = apartados[0]?.texto_oficial || textoOficial;
  const oraciones = textoOficial
    .replace(/\n+/g, ' ')
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const oracionBase = (oraciones[0] || primerApartado).replace(/^\d+\.\s*/, '').trim();
  const fragmentoLiteral =
    oracionBase.length > 210 ? oracionBase.slice(0, 207).trim() + '...' : oracionBase;

  // Crear distractores realistas de oposición (trampa de verbo/carácter, trampa de plazo/mayoría, trampa de órgano)
  let opcionA = fragmentoLiteral;
  let detalleTrampa = '';

  if (/ley orgánica/i.test(fragmentoLiteral)) {
    opcionA = fragmentoLiteral.replace(/ley orgánica/gi, 'ley ordinaria o real decreto');
    detalleTrampa = 'el precepto exige expresamente "ley orgánica", no ley ordinaria ni reglamento';
  } else if (/ley/i.test(fragmentoLiteral)) {
    opcionA = fragmentoLiteral.replace(/\bley\b/i, 'ley orgánica con mayoría de tres quintos');
    detalleTrampa = 'la Constitución remite a la "ley" (reserva de ley ordinaria), sin exigir ley orgánica en este punto';
  } else if (/podrán/i.test(fragmentoLiteral)) {
    opcionA = fragmentoLiteral.replace(/podrán/gi, 'deberán obligatoriamente en todo caso');
    detalleTrampa = 'el texto constitucional utiliza el verbo potestativo "podrán", no un mandato imperativo ("deberán")';
  } else if (/deberán|deberá/i.test(fragmentoLiteral)) {
    opcionA = fragmentoLiteral.replace(/deberán|deberá/gi, 'podrán discrecionalmente');
    detalleTrampa = 'la norma emplea un mandato imperativo ("deberá/deberán"), no una facultad potestativa ("podrán")';
  } else if (/derecho/i.test(fragmentoLiteral)) {
    opcionA = fragmentoLiteral.replace(/derecho/i, 'deber inexcusable sujeto a autorización previa');
    detalleTrampa = 'el artículo configura esta figura sin exigir autorización administrativa previa';
  } else {
    opcionA = `En ningún caso se aplicará lo dispuesto sobre ${temaGeneral.toLowerCase()} sin autorización previa del Tribunal Constitucional.`;
    detalleTrampa = 'el artículo no subordina su eficacia a autorización previa del Tribunal Constitucional';
  }

  const opcionB = fragmentoLiteral;

  const opcionC = `Para lo previsto en el artículo ${id} (${temaGeneral.toLowerCase()}), se requerirá siempre mayoría de dos tercios en un plazo improrrogable de cuarenta y ocho horas.`;

  const opcionD = `La competencia exclusiva para acordar y ejecutar lo previsto en el artículo ${id} corresponde únicamente al Consejo General del Poder Judicial a propuesta del Defensor del Pueblo.`;

  return {
    enunciado: `En relación con el artículo ${id} de la Constitución Española («${temaGeneral}»), señale la afirmación literal y constitucionalmente correcta:`,
    opciones: [opcionA, opcionB, opcionC, opcionD],
    indice_correcta: 1,
    trampa_explicacion: `Ojo al tenor literal del artículo ${id} de la CE: ${detalleTrampa}. Además, los distractores introducen mayorías cualificadas (2/3 en 48 horas) u órganos incompetentes (CGPJ / Defensor del Pueblo) ajenos al precepto oficial.`
  };
}
