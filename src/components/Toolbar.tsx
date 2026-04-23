import { createSignal, Show } from 'solid-js';
import { activeInstruments, snapshotProfile } from '../store';
import { buildShareUrl } from '../share';

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

  return (
    <div class="toolbar">
      <div class="toolbar-actions">
        <button type="button" onClick={exportPng}>
          Export PNG
        </button>
        <button type="button" onClick={copyShareLink}>
          <Show when={copied()} fallback="Copy share link">
            Copied!
          </Show>
        </button>
      </div>
    </div>
  );
}
