import { createSignal, Show } from 'solid-js';
import { activeInstruments, resetAll, snapshotProfile } from '../store';
import { buildShareUrl } from '../share';
import { theme, toggleTheme } from '../theme';

export function Toolbar() {
  const [copied, setCopied] = createSignal(false);

  function exportPng() {
    const canvas = document.querySelector('.radar-host canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognition-portrait-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyShareLink() {
    const url = buildShareUrl(snapshotProfile(), activeInstruments());
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link', url);
    }
  }

  function reset() {
    if (confirm('Reset all sliders to 50 and clear active instruments?')) {
      resetAll();
    }
  }

  return (
    <div class="toolbar">
      <div class="toolbar-actions">
        <button type="button" onClick={reset} title="Reset cognition + instruments">
          Reset
        </button>
        <button type="button" onClick={exportPng}>
          Export PNG
        </button>
        <button type="button" onClick={copyShareLink}>
          <Show when={copied()} fallback="Copy share link">
            Copied!
          </Show>
        </button>
        <button
          type="button"
          class="icon-only"
          onClick={toggleTheme}
          aria-label={theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Show when={theme() === 'dark'} fallback="☾">
            ☀
          </Show>
        </button>
      </div>
    </div>
  );
}
