import { createSignal, For } from 'solid-js';
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
  const tabRefs = new Map<Mode, HTMLButtonElement>();

  // Full ARIA tabs keyboard pattern: Left/Right arrows move and activate,
  // Home/End jump to the ends (WCAG 2.1.1).
  function onTabKeyDown(e: KeyboardEvent, current: Mode) {
    const idx = TABS.findIndex((t) => t.id === current);
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = TABS.length - 1;
    if (nextIdx === null) return;
    e.preventDefault();
    const next = TABS[nextIdx].id;
    setMode(next);
    tabRefs.get(next)?.focus();
  }

  return (
    <section class="build-panel">
      <h2 id="build-heading">Build the shape</h2>
      <div class="build-tabs" role="tablist" aria-labelledby="build-heading">
        <For each={TABS}>
          {(t) => (
            <button
              type="button"
              role="tab"
              id={`build-tab-${t.id}`}
              aria-controls="build-panel-body"
              class={mode() === t.id ? 'active' : ''}
              aria-selected={mode() === t.id}
              tabindex={mode() === t.id ? 0 : -1}
              ref={(el) => tabRefs.set(t.id, el)}
              onClick={() => setMode(t.id)}
              onKeyDown={(e) => onTabKeyDown(e, t.id)}
            >
              {t.label}
            </button>
          )}
        </For>
      </div>
      <p class="build-sub">{subFor()}</p>
      <div
        class="build-body"
        id="build-panel-body"
        role="tabpanel"
        aria-labelledby={`build-tab-${mode()}`}
        tabindex="0"
      >
        {mode() === 'questions' && <QuestionFlow />}
        {mode() === 'sliders' && <DomainSliders />}
        {mode() === 'pdf' && <PdfImport />}
        {mode() === 'describe' && <FreeTextImport />}
      </div>
    </section>
  );
}
