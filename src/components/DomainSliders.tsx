import { For, createSignal, Show } from 'solid-js';
import { DOMAINS } from '../domains';
import { profile, setDomain } from '../store';
import type { DomainId } from '../types';

export function DomainSliders() {
  const [openInfo, setOpenInfo] = createSignal<DomainId | null>(null);

  return (
    <div class="sliders-list">
      <For each={DOMAINS}>
        {(d) => (
          <div class="slider-row">
            <div class="slider-head">
              <span class="slider-label" title={d.description}>
                {d.label}
              </span>
              <span class="slider-value">{profile[d.id]}</span>
              <button
                type="button"
                class="slider-info"
                aria-label={`About ${d.label}`}
                title={`About ${d.label}`}
                onClick={() => setOpenInfo(openInfo() === d.id ? null : d.id)}
              >
                i
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={profile[d.id]}
              onInput={(e) => setDomain(d.id, parseInt(e.currentTarget.value, 10))}
            />
            <span class="slider-clinical">{d.clinicalTerm}</span>
            <Show when={openInfo() === d.id}>
              <div class="slider-info-panel">
                <p>{d.extendedDescription}</p>
                <details>
                  <summary>Sources</summary>
                  <ul>
                    <For each={d.citations}>
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
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
