import type { CognitionProfile, DomainId } from './types';

type PdfPageTextItem = { str?: string };
type PdfPageText = { items: PdfPageTextItem[] };
type PdfDoc = {
  numPages: number;
  getPage(n: number): Promise<{ getTextContent(): Promise<PdfPageText> }>;
};

let pdfjsReady: Promise<{
  getDocument(src: { data: ArrayBuffer }): { promise: Promise<PdfDoc> };
}> | null = null;

function loadPdfjs() {
  if (!pdfjsReady) {
    pdfjsReady = (async () => {
      const mod = (await import('pdfjs-dist')) as unknown as {
        GlobalWorkerOptions: { workerSrc: string };
        getDocument: (src: { data: ArrayBuffer }) => { promise: Promise<PdfDoc> };
      };
      const workerUrl = (
        await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
      ).default;
      mod.GlobalWorkerOptions.workerSrc = workerUrl;
      return mod;
    })();
  }
  return pdfjsReady;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await loadPdfjs();
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it) => it.str ?? '').join(' '));
  }
  return pages.join('\n');
}

// Maps a WISC-V / WAIS-IV standard score (mean 100, SD 15) to our 0–100 scale.
// Score 55 → 5, 100 → 50, 145 → 95.
function standardToScale(score: number): number {
  const clamped = Math.max(55, Math.min(145, score));
  return Math.round(((clamped - 55) / 90) * 90 + 5);
}

type Pattern = { domain: DomainId; regexes: RegExp[] };

const PATTERNS: Pattern[] = [
  {
    domain: 'words',
    regexes: [
      /verbal\s+comprehension\s+index[^0-9]{0,30}(\d{2,3})/i,
      /\bVCI\b[^0-9]{0,20}(\d{2,3})/,
    ],
  },
  {
    domain: 'space',
    regexes: [
      /visual[-\s]?spatial\s+index[^0-9]{0,30}(\d{2,3})/i,
      /\bVSI\b[^0-9]{0,20}(\d{2,3})/,
    ],
  },
  {
    domain: 'puzzles',
    regexes: [
      /fluid\s+reasoning\s+index[^0-9]{0,30}(\d{2,3})/i,
      /\bFRI\b[^0-9]{0,20}(\d{2,3})/,
    ],
  },
  {
    domain: 'holding',
    regexes: [
      /working\s+memory\s+index[^0-9]{0,30}(\d{2,3})/i,
      /\bWMI\b[^0-9]{0,20}(\d{2,3})/,
    ],
  },
  {
    domain: 'quick',
    regexes: [
      /processing\s+speed\s+index[^0-9]{0,30}(\d{2,3})/i,
      /\bPSI\b[^0-9]{0,20}(\d{2,3})/,
    ],
  },
  {
    domain: 'reading',
    regexes: [
      /total\s+reading[^0-9]{0,30}(\d{2,3})/i,
      /reading\s+composite[^0-9]{0,30}(\d{2,3})/i,
      /word\s+reading[^0-9]{0,30}(\d{2,3})/i,
    ],
  },
  {
    domain: 'writing',
    regexes: [
      /written\s+expression[^0-9]{0,30}(\d{2,3})/i,
      /writing\s+composite[^0-9]{0,30}(\d{2,3})/i,
    ],
  },
  {
    domain: 'numbers',
    regexes: [
      /\bmathematics?\b[^0-9]{0,30}(\d{2,3})/i,
      /math(s)?\s+composite[^0-9]{0,30}(\d{2,3})/i,
      /numerical\s+operations[^0-9]{0,30}(\d{2,3})/i,
    ],
  },
];

export type ParseResult = {
  scores: Partial<CognitionProfile>;
  matched: DomainId[];
  missed: DomainId[];
};

export function parseWiscScores(text: string): ParseResult {
  const normalised = text.replace(/\s+/g, ' ');
  const scores: Partial<CognitionProfile> = {};
  const matched: DomainId[] = [];
  for (const { domain, regexes } of PATTERNS) {
    for (const rx of regexes) {
      const m = normalised.match(rx);
      if (m) {
        const raw = parseInt(m[1]!, 10);
        if (Number.isFinite(raw) && raw >= 40 && raw <= 160) {
          scores[domain] = standardToScale(raw);
          matched.push(domain);
          break;
        }
      }
    }
  }
  const missed = PATTERNS.map((p) => p.domain).filter((d) => !matched.includes(d));
  return { scores, matched, missed };
}
