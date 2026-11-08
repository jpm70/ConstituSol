import fs from 'fs';
import path from 'path';
import { mnemonics_1_60, MnemonicMeta } from './mnemonics_1_60';
import { mnemonics_61_120 } from './mnemonics_61_120';
import { mnemonics_121_169 } from './mnemonics_121_169';
import { temasGenerales, conceptosApartados } from './apartados_concepts';
import { buildTestTrampaForArticle, TestTrampa } from './test_trampas_generator';

const txtFiles = [
  'public/assets/aistudio/1-30_a5b8dc49.txt',
  'public/assets/aistudio/31-60_d7a83ef8.txt',
  'public/assets/aistudio/61-90_b667a6fb.txt',
  'public/assets/aistudio/91-120_bdc39932.txt',
  'public/assets/aistudio/121-150_6e041e26.txt',
  'public/assets/aistudio/151-FIN_815ed6a2.txt'
];

let rawCorpus = '';
for (const file of txtFiles) {
  const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8');
  rawCorpus += '\n' + content;
}

function extractArticles(text: string): Record<number, string> {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const cleanedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed === 'BOLETÍN OFICIAL DEL ESTADO' ||
      trimmed === 'LEGISLACIÓN CONSOLIDADA' ||
      /^Página \d+$/.test(trimmed) ||
      trimmed === 'CONSTITUCIÓN' ||
      /^TÍTULO (PRELIMINAR|[IVX]+)$/.test(trimmed) ||
      /^CAPÍTULO (PRIMERO|SEGUNDO|TERCERO|CUARTO|QUINTO)$/.test(trimmed) ||
      /^Sección [12]\.ª /.test(trimmed) ||
      trimmed === 'De los derechos y deberes fundamentales' ||
      trimmed === 'De los españoles y los extranjeros' ||
      trimmed === 'Derechos y libertades' ||
      trimmed === 'De los principios rectores de la política social y económica' ||
      trimmed === 'De las garantías de las libertades y derechos fundamentales' ||
      trimmed === 'De la suspensión de los derechos y libertades' ||
      trimmed === 'De la Corona' ||
      trimmed === 'De las Cortes Generales' ||
      trimmed === 'De las Cámaras' ||
      trimmed === 'De la elaboración de las leyes' ||
      trimmed === 'De los Tratados Internacionales' ||
      trimmed === 'Del Gobierno y de la Administración' ||
      trimmed === 'De las relaciones entre el Gobierno y las Cortes Generales' ||
      trimmed === 'Del Poder Judicial' ||
      trimmed === 'Economía y Hacienda' ||
      trimmed === 'De la Organización Territorial del Estado' ||
      trimmed === 'Principios generales' ||
      trimmed === 'De la Administración Local' ||
      trimmed === 'De las Comunidades Autónomas' ||
      trimmed === 'Del Tribunal Constitucional' ||
      trimmed === 'De la reforma constitucional'
    ) {
      continue;
    }
    cleanedLines.push(line);
  }

  const joined = cleanedLines.join('\n');
  const articles: Record<number, string> = {};

  for (let i = 1; i <= 169; i++) {
    const nextPattern = i < 169 ? `(?:\\nArtículo ${i + 1}\\.\\s*\\n)` : `(?:\\nDisposición adicional primera\\.)`;
    const fullRegex = new RegExp(`(?:^|\\n)(Artículo ${i}\\.\\s*\\n[\\s\\S]*?)${nextPattern}`);
    const match = joined.match(fullRegex);
    if (match && match[1]) {
      const rawArt = match[1].trim();
      const artLines = rawArt.split('\n').slice(1);
      const paragraphs: string[] = [];
      let currentPara = '';
      for (const l of artLines) {
        const t = l.trim();
        if (!t) continue;
        const isNewParagraph =
          /^\d+\.\s+/.test(t) ||
          /^\d+\.º\s+/.test(t) ||
          /^\d+\.ª\s+/.test(t) ||
          /^[a-z]\)\s+/.test(t) ||
          (currentPara.endsWith('.') && /^[A-ZÁÉÍÓÚÑ]/.test(t));
        if (isNewParagraph && currentPara) {
          paragraphs.push(currentPara.trim());
          currentPara = t;
        } else {
          currentPara = currentPara ? `${currentPara} ${t}` : t;
        }
      }
      if (currentPara) paragraphs.push(currentPara.trim());
      articles[i] = paragraphs.join('\n');
    } else {
      throw new Error(`Failed to extract Artículo ${i}`);
    }
  }

  return articles;
}

export interface ApartadoCE {
  id_apartado: string;
  concepto_clave: string;
  texto_oficial: string;
}

export interface ArticuloCasilleroPuro {
  id_articulo: string;
  tema_general: string;
  palabra_casillero: string;
  historia_mnemotecnica: string;
  prompt_imagen: string;
  apartados: ApartadoCE[];
  test_trampa: TestTrampa;
}

export interface ArticuloCE extends ArticuloCasilleroPuro {
  id: number;
  concepto_clave: string;
  texto_oficial: string;
  imagen_url: string;
}

function buildApartadosForArticle(artId: number, fullText: string): ApartadoCE[] {
  const lines = fullText.split('\n');
  const hasNumbered = lines.some((l) => /^\d+\.\s+/.test(l));

  if (hasNumbered) {
    const rawGroups: { num: string; lines: string[] }[] = [];
    for (const line of lines) {
      const m = line.match(/^(\d+)\.\s+(.*)$/);
      if (m) {
        rawGroups.push({ num: m[1], lines: [line] });
      } else if (rawGroups.length > 0) {
        rawGroups[rawGroups.length - 1].lines.push(line);
      } else {
        rawGroups.push({ num: '1', lines: [line] });
      }
    }

    return rawGroups.map((g) => {
      const id_apartado = `${artId}.${g.num}`;
      const concepto_clave = conceptosApartados[id_apartado];
      if (!concepto_clave) {
        throw new Error(`Missing concepto_clave for apartado ${id_apartado}`);
      }
      return {
        id_apartado,
        concepto_clave,
        texto_oficial: g.lines.join('\n')
      };
    });
  } else {
    const id_apartado = `${artId}.1`;
    const concepto_clave = conceptosApartados[id_apartado];
    if (!concepto_clave) {
      throw new Error(`Missing concepto_clave for single apartado ${id_apartado}`);
    }
    return [
      {
        id_apartado,
        concepto_clave,
        texto_oficial: lines.join('\n')
      }
    ];
  }
}

const extractedTexts = extractArticles(rawCorpus);
const allMnemonics: MnemonicMeta[] = [
  ...mnemonics_1_60,
  ...mnemonics_61_120,
  ...mnemonics_121_169
];

const pureJsonArray: ArticuloCasilleroPuro[] = allMnemonics.map((m) => {
  const tema = temasGenerales[m.id];
  if (!tema) {
    throw new Error(`Missing tema_general for article ${m.id}`);
  }
  const wordCount = tema.trim().split(/\s+/).length;
  if (wordCount < 3 || wordCount > 4) {
    throw new Error(`Artículo ${m.id} tema_general must be 3-4 words (got ${wordCount}): "${tema}"`);
  }

  const apartados = buildApartadosForArticle(m.id, extractedTexts[m.id]);
  const test_trampa = buildTestTrampaForArticle(
    m.id,
    tema,
    m.palabra_casillero,
    extractedTexts[m.id],
    apartados
  );

  return {
    id_articulo: String(m.id),
    tema_general: tema,
    palabra_casillero: m.palabra_casillero,
    historia_mnemotecnica: m.historia_mnemotecnica,
    prompt_imagen: m.prompt_imagen,
    apartados,
    test_trampa
  };
});

const fullSimulatorArray: ArticuloCE[] = pureJsonArray.map((item) => {
  const numId = parseInt(item.id_articulo, 10);
  return {
    ...item,
    id: numId,
    concepto_clave: item.tema_general,
    texto_oficial: extractedTexts[numId],
    imagen_url: `./assets/images/art_${numId}.jpg`
  };
});

const pureJsonString = JSON.stringify(pureJsonArray, null, 2);
const fullSimulatorJsonString = JSON.stringify(fullSimulatorArray, null, 2);

const jsFileContent = `/**
 * Base de datos completa de ConstituSol (Sistema Mayor + Modo Cazador de Trampas) — Constitución Española (Artículos 1 a 169)
 * Estructura jerárquica con apartados y test_trampa (id_articulo, tema_general, palabra_casillero, historia_mnemotecnica, prompt_imagen, apartados, test_trampa).
 */
const constitucion_db = ${fullSimulatorJsonString};
const constitucion_json_puro = ${pureJsonString};
if (typeof window !== 'undefined') {
  window.constitucion_db = constitucion_db;
  window.constitucion_json_puro = constitucion_json_puro;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { constitucion_db, constitucion_json_puro };
}
`;

const tsFileContent = `/**
 * Base de datos completa de ConstituSol (Sistema Mayor + Modo Cazador de Trampas) — Constitución Española (Artículos 1 a 169)
 * Estructura jerárquica por apartados con texto oficial consolidado del BOE y objeto test_trampa.
 */
export interface ApartadoCE {
  id_apartado: string;
  concepto_clave: string;
  texto_oficial: string;
}

export interface TestTrampa {
  enunciado: string;
  opciones: [string, string, string, string];
  indice_correcta: number;
  trampa_explicacion: string;
}

export interface ArticuloCasilleroPuro {
  id_articulo: string;
  tema_general: string;
  palabra_casillero: string;
  historia_mnemotecnica: string;
  prompt_imagen: string;
  apartados: ApartadoCE[];
  test_trampa: TestTrampa;
}

export interface ArticuloCE extends ArticuloCasilleroPuro {
  id: number;
  concepto_clave: string;
  texto_oficial: string;
  imagen_url: string;
}

export const constitucion_json_puro: ArticuloCasilleroPuro[] = ${pureJsonString};

export const constitucion_db: ArticuloCE[] = ${fullSimulatorJsonString};
`;

fs.writeFileSync(path.resolve(process.cwd(), 'datos_ce.js'), jsFileContent, 'utf-8');
fs.writeFileSync(path.resolve(process.cwd(), 'public/datos_ce.js'), jsFileContent, 'utf-8');
fs.writeFileSync(path.resolve(process.cwd(), 'public/constitucion_db.json'), pureJsonString, 'utf-8');
fs.writeFileSync(path.resolve(process.cwd(), 'public/constitucion_apartados.json'), pureJsonString, 'utf-8');
fs.writeFileSync(path.resolve(process.cwd(), 'src/datos_ce.ts'), tsFileContent, 'utf-8');

const totalApartados = pureJsonArray.reduce((acc, a) => acc + a.apartados.length, 0);
console.log(`Generated ${pureJsonArray.length} articles, ${totalApartados} apartados, and ${pureJsonArray.length} test_trampa objects successfully!`);

