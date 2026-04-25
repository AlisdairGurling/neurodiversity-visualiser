import { createSignal } from 'solid-js';
import { PdfImport } from './PdfImport';
import { FreeTextImport } from './FreeTextImport';
import { QuestionFlow } from './QuestionFlow';

type Mode = 'questions' | 'pdf' | 'describe';

export function ImportPanel() {
  const [mode, setMode] = createSignal<Mode>('questions');
  const [open, setOpen] = createSignal(true);

  return (
    <section class="import-panel">
      <button
        type="button"
        class="import-toggle"
        onClick={() => setOpen(!open())}
        aria-expanded={open()}
      >
        <span>Build the shape</span>
        <span class="import-chevron">{open() ? '▾' : '▸'}</span>
      </button>
      {open() && (
        <div class="import-body">
          <div class="import-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              class={mode() === 'questions' ? 'active' : ''}
              aria-selected={mode() === 'questions'}
              onClick={() => setMode('questions')}
            >
              Questions
            </button>
            <button
              type="button"
              role="tab"
              class={mode() === 'pdf' ? 'active' : ''}
              aria-selected={mode() === 'pdf'}
              onClick={() => setMode('pdf')}
            >
              Drop PDF
            </button>
            <button
              type="button"
              role="tab"
              class={mode() === 'describe' ? 'active' : ''}
              aria-selected={mode() === 'describe'}
              onClick={() => setMode('describe')}
            >
              Describe
            </button>
          </div>
          {mode() === 'questions' && <QuestionFlow />}
          {mode() === 'pdf' && <PdfImport />}
          {mode() === 'describe' && <FreeTextImport />}
        </div>
      )}
    </section>
  );
}
