import { createSignal, For, Show } from 'solid-js';
import {
  QUESTIONS,
  QUESTION_CITATIONS,
  type Question,
  type QuestionOption,
} from '../questions';
import {
  experienceMode,
  profile,
  questionSelections,
  setDomain,
  setQuestionSelections,
} from '../store';
import type { DomainId } from '../types';

function applyLifts(opt: QuestionOption, sign: 1 | -1) {
  for (const [k, v] of Object.entries(opt.lifts)) {
    const dom = k as DomainId;
    setDomain(dom, profile[dom] + (v ?? 0) * sign);
  }
}

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

function questionHasAnswer(qId: string, selections: ReadonlySet<string>) {
  for (const key of selections) if (key.startsWith(`${qId}/`)) return true;
  return false;
}

export function QuestionFlow() {
  // Multiple questions can be open at once so users can go back to add or
  // remove options in earlier questions without losing their place. The very
  // first question opens by default so there's always somewhere to start.
  const [openIds, setOpenIds] = createSignal<Set<string>>(
    new Set(QUESTIONS[0] ? [QUESTIONS[0].id] : []),
  );
  const soundOn = () => experienceMode() === 'sound';
  const wordFirst = () => experienceMode() === 'word';

  const isOpen = (q: Question) => wordFirst() || openIds().has(q.id);

  const isPicked = (q: Question, opt: QuestionOption) =>
    questionSelections().has(`${q.id}/${opt.id}`);

  function toggleOpen(id: string) {
    const next = new Set(openIds());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenIds(next);
  }

  function toggle(q: Question, opt: QuestionOption) {
    const key = `${q.id}/${opt.id}`;
    const prev = questionSelections();
    const previouslyAnswered = questionHasAnswer(q.id, prev);
    const adding = !prev.has(key);

    const next = new Set(prev);
    if (next.has(key)) {
      next.delete(key);
      applyLifts(opt, -1);
    } else {
      next.add(key);
      applyLifts(opt, 1);
    }
    setQuestionSelections(next);

    // When the user gives a question its first answer, open the next
    // unanswered question so the flow keeps moving forward. The current
    // question stays open — multi-select is preserved and the user can
    // continue adding to it.
    if (adding && !previouslyAnswered) {
      const idx = QUESTIONS.findIndex((qq) => qq.id === q.id);
      const nextQ = QUESTIONS.slice(idx + 1).find(
        (qq) => !questionHasAnswer(qq.id, next),
      );
      if (nextQ) {
        const openNext = new Set(openIds());
        openNext.add(nextQ.id);
        setOpenIds(openNext);
        requestAnimationFrame(() => {
          const el = document.querySelector(
            `[data-question-id="${nextQ.id}"]`,
          ) as HTMLElement | null;
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        });
      }
    }
  }

  function clearAll() {
    if (!confirm('Clear all answers and remove their effect on the shape?')) return;
    for (const q of QUESTIONS) {
      for (const opt of q.options) {
        if (questionSelections().has(`${q.id}/${opt.id}`)) applyLifts(opt, -1);
      }
    }
    setQuestionSelections(new Set<string>());
    setOpenIds(new Set(QUESTIONS[0] ? [QUESTIONS[0].id] : []));
  }

  function readWhole(q: Question) {
    const optionText = q.options.map((o) => o.label).join('. ');
    const full = `${q.prompt}${q.hint ? '. ' + q.hint : ''}. Options: ${optionText}.`;
    speak(full);
  }

  return (
    <div class="question-flow">
      <p class="question-intro">
        Pick whatever feels true. There is no order, no scoring, no right answer.
        Answering a question opens the next one — you can always go back.
      </p>

      <details class="question-about" open={wordFirst() || undefined}>
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
            const answeredCount = () =>
              q.options.filter((o) => questionSelections().has(`${q.id}/${o.id}`)).length;
            return (
              <div
                data-question-id={q.id}
                class={`question-card ${isOpen(q) ? 'open' : ''} ${
                  answeredCount() > 0 ? 'answered' : ''
                }`}
              >
                <div class="question-head-row">
                  <button
                    type="button"
                    class="question-head"
                    onClick={() => toggleOpen(q.id)}
                    aria-expanded={isOpen(q)}
                  >
                    <span class="question-prompt">{q.prompt}</span>
                    <Show when={answeredCount() > 0}>
                      <span class="question-count" aria-label={`${answeredCount()} chosen`}>
                        {answeredCount()}
                      </span>
                    </Show>
                  </button>
                  <Show when={soundOn()}>
                    <button
                      type="button"
                      class="question-listen"
                      onClick={() => readWhole(q)}
                      aria-label={`Read "${q.prompt}" aloud`}
                      title="Read aloud"
                    >
                      🔊
                    </button>
                  </Show>
                </div>
                <Show when={isOpen(q)}>
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
