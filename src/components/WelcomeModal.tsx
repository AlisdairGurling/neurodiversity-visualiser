import { createSignal, onMount, Show } from 'solid-js';

const STORAGE_KEY = 'nv.welcomeSeen';

export function WelcomeModal() {
  const [open, setOpen] = createSignal(false);

  onMount(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  });

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  }

  function reopen() {
    setOpen(true);
  }
  // Expose a way for elsewhere in the app to reopen the modal if needed.
  (window as unknown as { showWelcome?: () => void }).showWelcome = reopen;

  return (
    <Show when={open()}>
      <div class="welcome-backdrop" onClick={dismiss} role="presentation">
        <div
          class="welcome-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          onClick={(e) => e.stopPropagation()}
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

          <div class="welcome-video-slot" aria-hidden="true">
            <span>A short video introduction will live here.</span>
          </div>

          <button type="button" class="primary" onClick={dismiss}>
            Get started
          </button>
        </div>
      </div>
    </Show>
  );
}
