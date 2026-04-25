import { createSignal, For, Show } from 'solid-js';
import { QUESTIONS, type Question, type QuestionOption } from '../questions';
import { profile, setDomain } from '../store';
import type { DomainId } from '../types';

const STORAGE_KEY = 'nv.questionSelections';

function loadSelections(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveSelections(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function applyLifts(opt: QuestionOption, sign: 1 | -1) {
  for (const [k, v] of Object.entries(opt.lifts)) {
    const dom = k as DomainId;
    setDomain(dom, profile[dom] + (v ?? 0) * sign);
  }
}

export function QuestionFlow() {
  const [selected, setSelected] = createSignal<Set<string>>(loadSelections());
  const [openId, setOpenId] = createSignal<string | null>(null);

  function toggle(q: Question, opt: QuestionOption) {
    const key = `${q.id}/${opt.id}`;
    const next = new Set(selected());
    if (next.has(key)) {
      next.delete(key);
      applyLifts(opt, -1);
    } else {
      next.add(key);
      applyLifts(opt, 1);
    }
    setSelected(next);
    saveSelections(next);
  }

  function clearAll() {
    if (!confirm('Clear all answers and remove their effect on the shape?')) return;
    for (const q of QUESTIONS) {
      for (const opt of q.options) {
        const key = `${q.id}/${opt.id}`;
        if (selected().has(key)) applyLifts(opt, -1);
      }
    }
    const empty = new Set<string>();
    setSelected(empty);
    saveSelections(empty);
  }

  return (
    <div class="question-flow">
      <p class="question-intro">
        Pick whatever feels true. There is no order, no scoring, no right answer
        — each choice nudges the shape on the canvas.
      </p>
      <div class="question-grid">
        <For each={QUESTIONS}>
          {(q) => {
            const isOpen = () => openId() === q.id;
            const answeredCount = () =>
              q.options.filter((o) => selected().has(`${q.id}/${o.id}`)).length;
            return (
              <div
                class={`question-card ${isOpen() ? 'open' : ''} ${
                  answeredCount() > 0 ? 'answered' : ''
                }`}
              >
                <button
                  type="button"
                  class="question-head"
                  onClick={() => setOpenId(isOpen() ? null : q.id)}
                  aria-expanded={isOpen()}
                >
                  <span class="question-prompt">{q.prompt}</span>
                  <Show when={answeredCount() > 0}>
                    <span class="question-count" aria-label={`${answeredCount()} chosen`}>
                      {answeredCount()}
                    </span>
                  </Show>
                </button>
                <Show when={isOpen()}>
                  <div class="question-body">
                    <Show when={q.hint}>
                      <p class="question-hint">{q.hint}</p>
                    </Show>
                    <div class="question-options">
                      <For each={q.options}>
                        {(opt) => {
                          const isPicked = () => selected().has(`${q.id}/${opt.id}`);
                          return (
                            <button
                              type="button"
                              class={`option-chip ${isPicked() ? 'picked' : ''}`}
                              onClick={() => toggle(q, opt)}
                              aria-pressed={isPicked()}
                            >
                              {opt.label}
                            </button>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
      <Show when={selected().size > 0}>
        <button type="button" class="question-clear" onClick={clearAll}>
          Clear all answers
        </button>
      </Show>
    </div>
  );
}
