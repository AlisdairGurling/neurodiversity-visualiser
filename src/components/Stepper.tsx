import { For, Show } from 'solid-js';
import { setStage, stage, type Stage } from '../store';

const STEPS: { id: Stage; label: string; hint: string }[] = [
  { id: 'answer', label: 'Answer', hint: 'Build the shape from prompts, a PDF, or a description.' },
  { id: 'reveal', label: 'Reveal', hint: 'See the shape emerge; fine-tune the sliders.' },
  { id: 'extend', label: 'Extend', hint: 'Layer instruments of change to extend the cognition.' },
];

const INDEX: Record<Stage, number> = { answer: 0, reveal: 1, extend: 2 };
const NEXT: Record<Stage, Stage | null> = {
  answer: 'reveal',
  reveal: 'extend',
  extend: null,
};

export function Stepper() {
  const nextStage = () => NEXT[stage()];
  const nextLabel = () =>
    nextStage() ? STEPS[INDEX[nextStage()!]].label : null;

  return (
    <nav class="stepper" aria-label="Stages">
      <ol>
        <For each={STEPS}>
          {(step, i) => {
            const current = () => stage() === step.id;
            const done = () => INDEX[stage()] > i();
            return (
              <li
                class={`step ${current() ? 'current' : ''} ${done() ? 'done' : ''}`}
                aria-current={current() ? 'step' : undefined}
              >
                <button
                  type="button"
                  onClick={() => setStage(step.id)}
                  title={step.hint}
                >
                  <span class="step-number" aria-hidden="true">
                    {i() + 1}
                  </span>
                  <span class="step-label">{step.label}</span>
                </button>
              </li>
            );
          }}
        </For>
      </ol>
      <Show when={nextStage()}>
        <button
          type="button"
          class="stepper-continue"
          onClick={() => setStage(nextStage()!)}
        >
          Continue to {nextLabel()} →
        </button>
      </Show>
    </nav>
  );
}
