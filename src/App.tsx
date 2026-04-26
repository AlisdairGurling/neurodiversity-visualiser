import { createSignal, onMount, Show } from 'solid-js';
import { SoftRadar } from './components/SoftRadar';
import { InstrumentPalette } from './components/InstrumentPalette';
import { Toolbar } from './components/Toolbar';
import { ImportPanel } from './components/ImportPanel';
import { WelcomeModal } from './components/WelcomeModal';
import {
  activateInstrument,
  applyProfilePatch,
  loadInstruments,
  setActiveInstruments,
} from './store';
import { decodeShare } from './share';
import { applyTheme, theme } from './theme';

type MobilePane = 'sliders' | 'instruments';

export function App() {
  const [mobilePane, setMobilePane] = createSignal<MobilePane>('sliders');
  const [dropHint, setDropHint] = createSignal(false);

  onMount(() => {
    // Stop the browser auto-scrolling to a remembered position or to a non-
    // existent element matching a share-URL hash like "#p=...".
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

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
      <div class="app-body">
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
            // ignore leaves into descendant elements
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
          <SoftRadar />
          <Show when={dropHint()}>
            <div class="drop-overlay">
              <p>Drop to layer this instrument</p>
            </div>
          </Show>
          <p class="canvas-caption">
            Drag any vertex to reshape the cognition. On a desktop, drag an instrument onto the
            shape; on a phone, tap an instrument to layer it in.
          </p>
        </main>
        <div class="mobile-tabs" role="tablist" aria-label="Mobile panel selector">
          <button
            type="button"
            role="tab"
            aria-selected={mobilePane() === 'sliders'}
            class={mobilePane() === 'sliders' ? 'active' : ''}
            onClick={() => setMobilePane('sliders')}
          >
            Cognition
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobilePane() === 'instruments'}
            class={mobilePane() === 'instruments' ? 'active' : ''}
            onClick={() => setMobilePane('instruments')}
          >
            Instruments
          </button>
        </div>
        <aside class="sliders" data-mobile-hidden={mobilePane() !== 'sliders'}>
          <ImportPanel />
        </aside>
        <aside class="instruments" data-mobile-hidden={mobilePane() !== 'instruments'}>
          <h2>Instruments of change</h2>
          <InstrumentPalette />
        </aside>
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
