import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';

const STORAGE_KEY = 'nv.welcomeSeen';

// Drop a file into public/videos/ at these paths to populate the welcome
// video. The fetch HEAD-check below means the placeholder is shown until a
// real file is present, with no console error noise.
const VIDEO_PATH = '/videos/welcome.mp4';
const POSTER_PATH = '/videos/welcome-poster.jpg';

export function WelcomeModal() {
  const [open, setOpen] = createSignal(false);
  const [hasVideo, setHasVideo] = createSignal(false);
  const [hasPoster, setHasPoster] = createSignal(false);

  onMount(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
    // Probe asset availability so we can degrade gracefully when files aren't there yet.
    fetch(VIDEO_PATH, { method: 'HEAD' })
      .then((r) => {
        if (r.ok) setHasVideo(true);
      })
      .catch(() => {});
    fetch(POSTER_PATH, { method: 'HEAD' })
      .then((r) => {
        if (r.ok) setHasPoster(true);
      })
      .catch(() => {});
  });

  // Lock body scroll while the modal is up — without this, mobile (and some
  // desktop browsers) let touch/scroll bleed through the backdrop, which can
  // cause the underlying page to drift to a non-top scroll position on first
  // visit.
  createEffect(() => {
    if (open()) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      onCleanup(() => {
        document.body.style.overflow = previous;
      });
    }
  });

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
    // Snap the page back to the top in case anything scrolled it while the
    // modal was up.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  function reopen() {
    setOpen(true);
  }
  // Expose a way for elsewhere in the app to reopen the modal (e.g. a future "show the intro again" link).
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

          <Show
            when={hasVideo()}
            fallback={
              <div class="welcome-video-slot" aria-hidden="true">
                <span>A short video introduction will live here.</span>
              </div>
            }
          >
            <div class="welcome-video">
              <video
                controls
                preload="metadata"
                playsinline
                poster={hasPoster() ? POSTER_PATH : undefined}
              >
                <source src={VIDEO_PATH} type="video/mp4" />
              </video>
            </div>
          </Show>

          <button type="button" class="primary" onClick={dismiss}>
            Get started
          </button>
        </div>
      </div>
    </Show>
  );
}
