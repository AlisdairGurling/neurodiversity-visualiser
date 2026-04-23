import { createSignal, Show } from 'solid-js';
import {
  extractFromDescription,
  getStoredApiKey,
  setStoredApiKey,
} from '../claude-extract';
import { applyProfilePatch } from '../store';
import { DOMAINS } from '../domains';
import type { DomainId } from '../types';

const DOMAIN_LABEL = new Map<DomainId, string>(DOMAINS.map((d) => [d.id, d.label]));

export function FreeTextImport() {
  const [apiKey, setApiKey] = createSignal(getStoredApiKey());
  const [description, setDescription] = createSignal('');
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [updated, setUpdated] = createSignal<DomainId[]>([]);

  async function run() {
    setError(null);
    setUpdated([]);
    if (!apiKey()) {
      setError('Add an Anthropic API key first.');
      return;
    }
    if (!description().trim()) {
      setError('Describe the cognition first.');
      return;
    }
    setBusy(true);
    try {
      const { scores } = await extractFromDescription(apiKey(), description());
      applyProfilePatch(scores);
      setUpdated(Object.keys(scores) as DomainId[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div class="import-section">
      <label class="import-field">
        <span>Anthropic API key</span>
        <input
          type="password"
          placeholder="sk-ant-…"
          value={apiKey()}
          onInput={(e) => {
            setApiKey(e.currentTarget.value);
            setStoredApiKey(e.currentTarget.value);
          }}
        />
        <small>Stored only in this browser. Calls go directly to Claude.</small>
      </label>
      <label class="import-field">
        <span>Describe the cognition</span>
        <textarea
          rows={5}
          placeholder="e.g. strong verbal reasoning, vivid visual thinker, struggles to hold sequences in mind, reading is slow but comprehension is rich…"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
      </label>
      <button class="primary" type="button" disabled={busy()} onClick={run}>
        {busy() ? 'Extracting…' : 'Extract with Claude'}
      </button>
      <Show when={error()}>
        <p class="import-error">{error()}</p>
      </Show>
      <Show when={updated().length > 0}>
        <p class="import-result">
          Updated: {updated().map((id) => DOMAIN_LABEL.get(id)).join(', ')}
        </p>
      </Show>
    </div>
  );
}
