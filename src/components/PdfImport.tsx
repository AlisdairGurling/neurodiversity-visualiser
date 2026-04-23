import { createSignal, Show } from 'solid-js';
import { extractTextFromPdf, parseWiscScores, type ParseResult } from '../pdf-extract';
import { applyProfilePatch } from '../store';
import { DOMAINS } from '../domains';
import type { DomainId } from '../types';

const DOMAIN_LABEL = new Map<DomainId, string>(
  DOMAINS.map((d) => [d.id, d.label]),
);

export function PdfImport() {
  const [dragging, setDragging] = createSignal(false);
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [result, setResult] = createSignal<ParseResult | null>(null);
  const [rawText, setRawText] = createSignal<string>('');

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setRawText('');
    setBusy(true);
    try {
      const text = await extractTextFromPdf(file);
      setRawText(text);
      const parsed = parseWiscScores(text);
      setResult(parsed);
      if (Object.keys(parsed.scores).length > 0) {
        applyProfilePatch(parsed.scores);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div class="import-section">
      <div
        class={`dropzone ${dragging() ? 'dragging' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer?.files[0];
          if (file && file.type === 'application/pdf') handleFile(file);
          else setError('Drop a PDF file.');
        }}
      >
        <p>{busy() ? 'Reading PDF…' : 'Drop an EP report PDF here'}</p>
        <label class="file-picker">
          <input
            type="file"
            accept="application/pdf"
            disabled={busy()}
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <span>or choose a file</span>
        </label>
      </div>
      <Show when={error()}>
        <p class="import-error">{error()}</p>
      </Show>
      <Show when={result()}>
        {(r) => (
          <div class="import-result">
            <p>
              Found {r().matched.length} of {PATTERN_COUNT} Wechsler / WIAT indices.
            </p>
            <Show when={r().matched.length > 0}>
              <ul class="import-matched">
                {r().matched.map((id) => (
                  <li>{DOMAIN_LABEL.get(id)}</li>
                ))}
              </ul>
            </Show>
            <Show when={r().missed.length > 0}>
              <p class="import-missed">
                Not found (use the sliders):{' '}
                {r().missed.map((id) => DOMAIN_LABEL.get(id)).join(', ')}
              </p>
            </Show>
            <Show when={rawText()}>
              <details>
                <summary>Show extracted text</summary>
                <pre class="import-raw">{rawText().slice(0, 4000)}</pre>
              </details>
            </Show>
          </div>
        )}
      </Show>
    </div>
  );
}

const PATTERN_COUNT = 8;
