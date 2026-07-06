import { createSignal, onMount, Show } from 'solid-js';
import { SoftRadar } from './components/SoftRadar';
import { InstrumentPalette } from './components/InstrumentPalette';
import { Toolbar } from './components/Toolbar';
import { ImportPanel } from './components/ImportPanel';
import { WelcomeModal } from './components/WelcomeModal';
import { Stepper } from './components/Stepper';
import { RevealPlaceholder } from './components/RevealPlaceholder';
import {
  activateInstrument,
  applyProfilePatch,
  hoveredDomain,
  loadInstruments,
  setActiveInstruments,
  setStage,
  stage,
} from './store';
import { DOMAINS } from './domains';
import { decodeShare } from './share';
import { applyTheme, theme } from './theme';

type MobilePane = 'sliders' | 'instruments';

export function App() {
  const [mobilePane, setMobilePane] = createSignal<MobilePane>('sliders');
  const [dropHint, setDropHint] = createSignal(false);

  onMount(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));

    applyTheme(theme());

    loadInstruments();
    const decoded = decodeShare(window.location.hash);
    if (decoded) {
      applyProfilePatch(decoded.profile);
      if (decoded.active.length > 0) setActiveInstruments(decoded.active);
    }
  });

  return (
    <div class="app">
      <WelcomeModal />
      <header class="app-header">
        <div class="app-title">
          <h1>Neurodiversity Visualiser</h1>
          <p class="tagline">
            A strengths-based portrait of cognition, extended by instruments of change.
          </p>
        </div>
        <Toolbar />
      </header>
      <Stepper />
      <div class="app-body" data-stage={stage()}>
        <aside
          class="sliders"
          data-mobile-hidden={stage() === 'extend' && mobilePane() !== 'sliders'}
        >
          <ImportPanel />
          <Show when={stage() === 'answer'}>
            <button
              type="button"
              class="stage-forward primary"
              onClick={() => setStage('reveal')}
            >
              ✨ Reveal my shape
            </button>
          </Show>
          <Show when={stage() === 'reveal'}>
            <div class="stage-forward-row">
              <button
                type="button"
                class="stage-back"
                onClick={() => setStage('answer')}
              >
                ← Back to answering
              </button>
              <button
                type="button"
                class="stage-forward primary"
                onClick={() => setStage('extend')}
              >
                🌱 Extend with instruments
              </button>
            </div>
          </Show>
        </aside>

        <main
          class={`canvas-pane ${dropHint() ? 'drop-ready' : ''}`}
          onDragEnter={(e) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            setDropHint(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            setDropHint(true);
          }}
          onDragLeave={(e) => {
            const related = e.relatedTarget as Node | null;
            if (related && (e.currentTarget as Node).contains(related)) return;
            setDropHint(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer?.getData('text/plain');
            if (id) activateInstrument(id);
            setDropHint(false);
          }}
        >
          <Show
            when={stage() !== 'answer'}
            fallback={<RevealPlaceholder />}
          >
            <SoftRadar />
            <Show when={dropHint()}>
              <div class="drop-overlay">
                <p>Drop to layer this instrument</p>
              </div>
            </Show>
            <p class="canvas-caption">
              <Show
                when={hoveredDomain()}
                fallback={
                  <>
                    Hover a vertex for its description. Drag any vertex to reshape the cognition.
                    On a desktop, drag an instrument onto the shape; on a phone, tap an instrument
                    to layer it in.
                  </>
                }
              >
                {(id) => {
                  const d = DOMAINS.find((x) => x.id === id());
                  return (
                    <Show when={d}>
                      <span class="caption-icon" aria-hidden="true">{d!.icon}</span>
                      <span class="caption-label">{d!.label}</span>
                      <span class="caption-clinical"> — {d!.clinicalTerm}</span>
                      <br />
                      <span class="caption-desc">{d!.description}</span>
                    </Show>
                  );
                }}
              </Show>
            </p>
          </Show>
        </main>

        <Show when={stage() === 'extend'}>
          <div class="mobile-tabs" role="tablist" aria-label="Mobile panel selector">
            <button
              type="button"
              role="tab"
              aria-selected={mobilePane() === 'sliders'}
              class={mobilePane() === 'sliders' ? 'active' : ''}
              onClick={() => setMobilePane('sliders')}
            >
              📝 Cognition
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobilePane() === 'instruments'}
              class={mobilePane() === 'instruments' ? 'active' : ''}
              onClick={() => setMobilePane('instruments')}
            >
              🌱 Instruments
            </button>
          </div>
          <aside
            class="instruments"
            data-mobile-hidden={mobilePane() !== 'instruments'}
          >
            <h2>
              <span class="section-icon" aria-hidden="true">🌱</span>
              Instruments of change
            </h2>
            <InstrumentPalette />
          </aside>
        </Show>
      </div>
      <footer class="app-footer">
        <span>A project by Alisdair Gurling.</span>
        <span class="footer-note">
          Part of doctoral research into neurodivergent learning and instruments of change.
        </span>
      </footer>
    </div>
  );
}
