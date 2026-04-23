import { createSignal } from 'solid-js';
import { PdfImport } from './PdfImport';
import { FreeTextImport } from './FreeTextImport';

type Mode = 'pdf' | 'describe';

export function ImportPanel() {
  const [mode, setMode] = createSignal<Mode>('pdf');
  const [open, setOpen] = createSignal(false);

  return (
    <section class="import-panel">
      <button
        type="button"
        class="import-toggle"
        onClick={() => setOpen(!open())}
      >
        <span>Populate from a report</span>
        <span class="import-chevron">{open() ? '▾' : '▸'}</span>
      </button>
      {open() && (
        <div class="import-body">
          <div class="import-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              class={mode() === 'pdf' ? 'active' : ''}
              onClick={() => setMode('pdf')}
            >
              Drop PDF
            </button>
            <button
              type="button"
              role="tab"
              class={mode() === 'describe' ? 'active' : ''}
              onClick={() => setMode('describe')}
            >
              Describe in words
            </button>
          </div>
          {mode() === 'pdf' ? <PdfImport /> : <FreeTextImport />}
        </div>
      )}
    </section>
  );
}
