import { For, Show, createMemo } from 'solid-js';
import {
  activeInstruments,
  instrumentsCache,
  instrumentsLoadError,
  instrumentsLoadStatus,
  loadInstruments,
  toggleInstrument,
} from '../store';
import type { Instrument, InstrumentCategory, ToolLinePosition } from '../types';

const CATEGORY_META: Record<
  InstrumentCategory,
  { label: string; blurb: string; searchUrl: string }
> = {
  'digital-prosthetic': {
    label: 'Digital prosthetics',
    blurb: 'Technological extensions of cognition.',
    searchUrl: 'https://neurodiversity.tools/?category=digital-prosthetic',
  },
  'mind-body': {
    label: 'Mind-body strategies',
    blurb: 'Readying the body so cognition can land.',
    searchUrl: 'https://neurodiversity.tools/?category=mind-body',
  },
  relational: {
    label: 'Relational instruments',
    blurb: 'Cognition held in concert with others.',
    searchUrl: 'https://neurodiversity.tools/?category=relational',
  },
  'space-making': {
    label: 'Space-making',
    blurb: 'The atmosphere and pedagogy around the learner.',
    searchUrl: 'https://neurodiversity.tools/?category=space-making',
  },
};

const TOOL_LINE_LABEL: Record<ToolLinePosition, string> = {
  accepted: 'On the accepted side of the tool line',
  contested: 'On the contested edge of the tool line',
  stigmatised: 'On the stigmatised side of the tool line',
};

const NEURODIVERSITY_TOOLS_URL = 'https://neurodiversity.tools';

export function InstrumentPalette() {
  const grouped = createMemo(() => {
    const groups: Record<InstrumentCategory, Instrument[]> = {
      'digital-prosthetic': [],
      'mind-body': [],
      relational: [],
      'space-making': [],
    };
    for (const i of instrumentsCache()) groups[i.category].push(i);
    return groups;
  });

  return (
    <div class="palette">
      <a
        class="palette-search"
        href={NEURODIVERSITY_TOOLS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Search neurodiversity.tools →
      </a>

      <p class="palette-hint">
        Tap to toggle, or drag an instrument onto the shape to layer it in.
      </p>

      <ul class="tool-line-legend" aria-label="Tool line legend">
        <li>
          <span class="tool-line tool-line-accepted" /> Accepted
        </li>
        <li>
          <span class="tool-line tool-line-contested" /> Contested
        </li>
        <li>
          <span class="tool-line tool-line-stigmatised" /> Stigmatised
        </li>
      </ul>

      <Show when={instrumentsLoadStatus() === 'loading'}>
        <p class="palette-status">Loading instruments…</p>
      </Show>
      <Show when={instrumentsLoadStatus() === 'error'}>
        <div class="palette-status palette-error">
          <p>Couldn't load instruments: {instrumentsLoadError()}</p>
          <button type="button" onClick={() => loadInstruments()}>
            Retry
          </button>
        </div>
      </Show>

      <For each={Object.entries(CATEGORY_META) as [InstrumentCategory, { label: string; blurb: string; searchUrl: string }][]}>
        {([cat, meta]) => (
          <section class="palette-category">
            <header>
              <h3>{meta.label}</h3>
              <p>{meta.blurb}</p>
            </header>
            <ul>
              <For each={grouped()[cat]}>
                {(inst) => {
                  const isActive = () => activeInstruments().has(inst.id);
                  return (
                    <li class={`instrument ${isActive() ? 'active' : ''}`}>
                      <button
                        type="button"
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer?.setData('text/plain', inst.id);
                          e.dataTransfer!.effectAllowed = 'copy';
                        }}
                        onClick={() => toggleInstrument(inst.id)}
                      >
                        <span
                          class={`tool-line tool-line-${inst.toolLine}`}
                          title={TOOL_LINE_LABEL[inst.toolLine]}
                        />
                        <span class="instrument-body">
                          <span class="instrument-head">
                            <span class="instrument-name">{inst.name}</span>
                            <Show when={inst.externalLink}>
                              <a
                                class="instrument-link"
                                href={inst.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                draggable={false}
                                title="Open on neurodiversity.tools"
                              >
                                ↗
                              </a>
                            </Show>
                          </span>
                          <span class="instrument-desc">{inst.description}</span>
                        </span>
                        <span class="instrument-grip" aria-hidden="true">⋮⋮</span>
                      </button>
                    </li>
                  );
                }}
              </For>
            </ul>
            <a
              class="category-search"
              href={meta.searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Live search index coming soon"
            >
              Browse more {meta.label.toLowerCase()} <em>(coming soon)</em>
            </a>
          </section>
        )}
      </For>
    </div>
  );
}
