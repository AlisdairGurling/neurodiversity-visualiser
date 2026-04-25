import { createSignal, onMount } from 'solid-js';
import { SoftRadar } from './components/SoftRadar';
import { DomainSliders } from './components/DomainSliders';
import { InstrumentPalette } from './components/InstrumentPalette';
import { Toolbar } from './components/Toolbar';
import { ImportPanel } from './components/ImportPanel';
import { applyProfilePatch, loadInstruments, setActiveInstruments } from './store';
import { decodeShare } from './share';

type MobilePane = 'sliders' | 'instruments';

export function App() {
  const [mobilePane, setMobilePane] = createSignal<MobilePane>('sliders');

  onMount(() => {
    // Stop the browser auto-scrolling to a remembered position or to a non-
    // existent element matching a share-URL hash like "#p=...".
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    loadInstruments();
    const decoded = decodeShare(window.location.hash);
    if (decoded) {
      applyProfilePatch(decoded.profile);
      if (decoded.active.length > 0) setActiveInstruments(decoded.active);
    }
  });

  return (
    <div class="app">
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
        <main class="canvas-pane">
          <SoftRadar />
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
          <h2>Describe the cognition</h2>
          <DomainSliders />
        </aside>
        <aside class="instruments" data-mobile-hidden={mobilePane() !== 'instruments'}>
          <h2>Instruments of change</h2>
          <InstrumentPalette />
        </aside>
      </div>
      <footer class="app-footer">
        <span>A project by Alisdair Gurling.</span>
        <span class="footer-note">
          Part of ongoing doctoral research into neurodivergent learning and instruments of change.
        </span>
      </footer>
    </div>
  );
}
