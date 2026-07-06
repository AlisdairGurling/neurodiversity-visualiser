import { createEffect, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { experienceMode, setExperienceMode, type ExperienceMode } from '../store';

const STORAGE_KEY = 'nv.welcomeSeen';

const MODES: { id: ExperienceMode; label: string; blurb: string }[] = [
  { id: 'visual', label: 'Visual-first', blurb: 'Let the shape do the talking.' },
  { id: 'word', label: 'Word-first', blurb: 'Descriptions open by default.' },
  { id: 'sound', label: 'Sound-first', blurb: 'Prompts can be read aloud.' },
];

// To publish the welcome video: drop the files into public/videos/ at the
// paths below, then flip SHOW_WELCOME_VIDEO to true. A constant (rather than
// a runtime probe) keeps the network tab free of 404s while the files don't
// exist yet — browsers log failed requests to the console regardless of any
// JS-side handling, and Lighthouse flags them.
const SHOW_WELCOME_VIDEO = false;
const SHOW_POSTER = false;
const VIDEO_PATH = '/videos/welcome.mp4';
const POSTER_PATH = '/videos/welcome-poster.jpg';

export function WelcomeModal() {
  const [open, setOpen] = createSignal(false);
  let modalRef: HTMLDivElement | undefined;
  let lastFocused: HTMLElement | null = null;

  onMount(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  });

  // Lock body scroll while the modal is up — without this, mobile (and some
  // desktop browsers) let touch/scroll bleed through the backdrop, which can
  // cause the underlying page to drift to a non-top scroll position on first
  // visit. Also move focus into the dialog (WCAG 2.4.3) and remember where it
  // came from so dismissal can restore it.
  createEffect(() => {
    if (open()) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lastFocused = document.activeElement as HTMLElement | null;
      queueMicrotask(() => modalRef?.focus());
      onCleanup(() => {
        document.body.style.overflow = previous;
      });
    }
  });

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
    lastFocused?.focus();
    // Snap the page back to the top in case anything scrolled it while the
    // modal was up.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  // Keep Tab cycling inside the dialog while it's open (no keyboard trap
  // outside it, WCAG 2.1.2), and let Escape close it.
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      dismiss();
      return;
    }
    if (e.key !== 'Tab' || !modalRef) return;
    const focusables = modalRef.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === modalRef)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function reopen() {
    setOpen(true);
  }
  // Expose a way for elsewhere in the app to reopen the modal (e.g. the footer's "Show intro again" link).
  (window as unknown as { showWelcome?: () => void }).showWelcome = reopen;

  return (
    <Show when={open()}>
      <div class="welcome-backdrop" onClick={dismiss} role="presentation">
        <div
          class="welcome-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          tabindex="-1"
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
        >
          <h2 id="welcome-title">Welcome</h2>

          <p class="welcome-lede">
            <strong>Neurodiversity Visualiser</strong> turns the way someone's mind
            works into a soft, organic shape — a strengths-based portrait, not a
            score sheet.
          </p>

          <p>Three ways to start:</p>
          <ul class="welcome-paths">
            <li>
              <strong>Build the shape</strong> — answer a handful of playful prompts
              about what your mind is drawn to. No order, no numbers.
            </li>
            <li>
              <strong>Drop a PDF</strong> — an Educational Psychologist's report
              becomes a shape automatically (where it can; the questions can fill
              the gaps).
            </li>
            <li>
              <strong>Describe in words</strong> — say it in your own language and
              Claude reads it into a structured profile.
            </li>
          </ul>

          <p>
            Then layer in <strong>instruments of change</strong> — the digital,
            mind-body, relational, and environmental supports that extend cognition
            beyond the boundary of a single skull. Watch the green grow over the
            orange as you stack them.
          </p>

          <Show
            when={SHOW_WELCOME_VIDEO}
            fallback={
              <div class="welcome-video-slot">
                <span>A short video introduction will live here.</span>
              </div>
            }
          >
            <div class="welcome-video">
              <video
                controls
                preload="metadata"
                playsinline
                poster={SHOW_POSTER ? POSTER_PATH : undefined}
              >
                <source src={VIDEO_PATH} type="video/mp4" />
              </video>
            </div>
          </Show>

          <fieldset class="welcome-mode">
            <legend>How would you like to explore?</legend>
            <div class="welcome-mode-options">
              <For each={MODES}>
                {(m) => (
                  <label
                    class={`welcome-mode-option ${experienceMode() === m.id ? 'chosen' : ''}`}
                  >
                    <input
                      type="radio"
                      name="experience-mode"
                      value={m.id}
                      checked={experienceMode() === m.id}
                      onChange={() => setExperienceMode(m.id)}
                    />
                    <span class="welcome-mode-label">{m.label}</span>
                    <span class="welcome-mode-blurb">{m.blurb}</span>
                  </label>
                )}
              </For>
            </div>
          </fieldset>

          <button type="button" class="primary" onClick={dismiss}>
            Get started
          </button>
        </div>
      </div>
    </Show>
  );
}
