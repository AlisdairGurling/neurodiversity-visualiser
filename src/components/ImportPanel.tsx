import { createSignal } from 'solid-js';
import { PdfImport } from './PdfImport';
import { FreeTextImport } from './FreeTextImport';
import { QuestionFlow } from './QuestionFlow';
import { DomainSliders } from './DomainSliders';

type Mode = 'questions' | 'sliders' | 'pdf' | 'describe';

const TABS: { id: Mode; label: string; sub: string }[] = [
  { id: 'questions', label: 'Questions', sub: 'Build the shape with playful prompts.' },
  { id: 'sliders', label: 'Sliders', sub: 'Fine-tune each domain by hand.' },
  { id: 'pdf', label: 'PDF', sub: 'Drop an EP report and pull what we can.' },
  { id: 'describe', label: 'Describe', sub: 'Say it in your own words.' },
];

export function ImportPanel() {
  const [mode, setMode] = createSignal<Mode>('questions');
  const subFor = () => TABS.find((t) => t.id === mode())?.sub ?? '';

  return (
    <section class="build-panel">
      <h2>Build the shape</h2>
      <div class="build-tabs" role="tablist" aria-label="Ways to build the shape">
        {TABS.map((t) => (
          <button
            type="button"
            role="tab"
            class={mode() === t.id ? 'active' : ''}
            aria-selected={mode() === t.id}
            onClick={() => setMode(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p class="build-sub">{subFor()}</p>
      <div class="build-body">
        {mode() === 'questions' && <QuestionFlow />}
        {mode() === 'sliders' && <DomainSliders />}
        {mode() === 'pdf' && <PdfImport />}
        {mode() === 'describe' && <FreeTextImport />}
      </div>
    </section>
  );
}
