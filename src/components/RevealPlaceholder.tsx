import { setStage } from '../store';

// Sits in the middle column during the Answer stage. Explains why the canvas
// is hidden and invites the user to reveal when they're ready.
export function RevealPlaceholder() {
  return (
    <div class="reveal-placeholder">
      <div class="placeholder-orb" aria-hidden="true">
        <div class="orb-inner" />
        <div class="orb-halo" />
      </div>
      <h3>Your shape is taking form.</h3>
      <p>
        The canvas is quiet on purpose. Answer whatever prompts feel true — or
        drop a PDF, or describe in words — without watching the shape react.
        There is no right answer.
      </p>
      <p class="placeholder-hint">
        Reveal when you're ready.
      </p>
      <button type="button" class="primary" onClick={() => setStage('reveal')}>
        ✨ Reveal my shape
      </button>
    </div>
  );
}
