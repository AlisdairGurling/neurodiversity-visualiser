import { createSignal, For, Show } from 'solid-js';
import {
  QUESTIONS,
  QUESTION_CITATIONS,
  type Question,
  type QuestionOption,
} from '../questions';
import { profile, questionSelections, setDomain, setQuestionSelections } from '../store';
import type { DomainId } from '../types';

function applyLifts(opt: QuestionOption, sign: 1 | -1) {
  for (const [k, v] of Object.entries(opt.lifts)) {
    const dom = k as DomainId;
    setDomain(dom, profile[dom] + (v ?? 0) * sign);
  }
}

export function QuestionFlow() {
  const [openId, setOpenId] = createSignal<string | null>(null);

  const isPicked = (q: Question, opt: QuestionOption) =>
    questionSelections().has(`${q.id}/${opt.id}`);

  function toggle(q: Question, opt: QuestionOption) {
    const key = `${q.id}/${opt.id}`;
    const next = new Set(questionSelections());
    if (next.has(key)) {
      next.delete(key);
      applyLifts(opt, -1);
    } else {
      next.add(key);
      applyLifts(opt, 1);
    }
    setQuestionSelections(next);
  }

  function clearAll() {
    if (!confirm('Clear all answers and remove their effect on the shape?')) return;
    for (const q of QUESTIONS) {
      for (const opt of q.options) {
        if (questionSelections().has(`${q.id}/${opt.id}`)) applyLifts(opt, -1);
      }
    }
    setQuestionSelections(new Set<string>());
  }

  return (
    <div class="question-flow">
      <p class="question-intro">
        Pick whatever feels true. There is no order, no scoring, no right answer
        — each choice nudges the shape on the canvas. The prompts cover all ten
        domains and lean towards how neurodivergent minds tend to be strong.
      </p>

      <details class="question-about">
        <summary>About these questions</summary>
        <p>
          Drawn from strengths-based research on neurodivergent cognition —
          dyslexic narrative and spatial reasoning, autistic enhanced perception
          and systemising, ADHD divergent thinking and hyperfocus — without using
          diagnostic labels. The final prompt names where energy gets spent so
          the shape can have troughs as well as peaks.
        </p>
        <ul>
          <For each={QUESTION_CITATIONS}>
            {(c) => (
              <li>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.text}
                  </a>
                ) : (
                  c.text
                )}
              </li>
            )}
          </For>
        </ul>
      </details>

      <div class="question-grid">
        <For each={QUESTIONS}>
          {(q) => {
            const isOpen = () => openId() === q.id;
            const answeredCount = () =>
              q.options.filter((o) => questionSelections().has(`${q.id}/${o.id}`)).length;
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
                        {(opt) => (
                          <button
                            type="button"
                            class={`option-chip ${isPicked(q, opt) ? 'picked' : ''}`}
                            onClick={() => toggle(q, opt)}
                            aria-pressed={isPicked(q, opt)}
                          >
                            {opt.label}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
      <Show when={questionSelections().size > 0}>
        <button type="button" class="question-clear" onClick={clearAll}>
          Clear all answers
        </button>
      </Show>
    </div>
  );
}
