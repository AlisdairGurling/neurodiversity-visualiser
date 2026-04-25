import { onMount, onCleanup } from 'solid-js';
import p5 from 'p5';
import { DOMAINS } from '../domains';
import {
  profile,
  activeInstruments,
  instrumentsCache,
  setDomain,
} from '../store';
import type { CognitionProfile, DomainId, Instrument } from '../types';

type Anchor = { angle: number; radius: number };

function applyLifts(base: CognitionProfile, inst: Instrument): CognitionProfile {
  const out = { ...base } as CognitionProfile;
  for (const [k, v] of Object.entries(inst.lifts)) {
    const key = k as DomainId;
    out[key] = Math.min(100, out[key] + (v ?? 0));
  }
  return out;
}

// Catmull-Rom on radii, linear on angle — guarantees a simple (non-self-intersecting) closed curve around the origin.
function densePath(
  anchors: Anchor[],
  cx: number,
  cy: number,
  segmentsPerEdge: number,
): { x: number; y: number }[] {
  const n = anchors.length;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const r0 = anchors[(i - 1 + n) % n].radius;
    const r1 = anchors[i].radius;
    const r2 = anchors[(i + 1) % n].radius;
    const r3 = anchors[(i + 2) % n].radius;
    const a1 = anchors[i].angle;
    let a2 = anchors[(i + 1) % n].angle;
    if (a2 <= a1) a2 += Math.PI * 2;
    for (let s = 0; s < segmentsPerEdge; s++) {
      const t = s / segmentsPerEdge;
      const tt = t * t;
      const ttt = tt * t;
      const r =
        0.5 *
        (2 * r1 +
          (-r0 + r2) * t +
          (2 * r0 - 5 * r1 + 4 * r2 - r3) * tt +
          (-r0 + 3 * r1 - 3 * r2 + r3) * ttt);
      const a = a1 + (a2 - a1) * t;
      const rr = Math.max(0, r);
      out.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
    }
  }
  return out;
}

export function SoftRadar() {
  let containerRef: HTMLDivElement | undefined;
  let instance: p5 | undefined;

  let resizeObs: ResizeObserver | undefined;

  onMount(() => {
    if (!containerRef) return;

    instance = new p5((p: p5) => {
      let t = 0;
      let draggingDomain: DomainId | null = null;
      let hoverDomain: DomainId | null = null;

      const vertexFor = (id: DomainId, cx: number, cy: number, r: number) => {
        const i = DOMAINS.findIndex((d) => d.id === id);
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / DOMAINS.length;
        const rr = (r * profile[id]) / 100;
        return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, angle: a };
      };

      const nearestDomain = (mx: number, my: number, cx: number, cy: number, r: number) => {
        let best: { id: DomainId; dist: number } | null = null;
        // Bigger hit-target on touch devices; comfortable on desktop too.
        const hitRadius = window.matchMedia('(pointer: coarse)').matches ? 36 : 28;
        for (const d of DOMAINS) {
          const v = vertexFor(d.id, cx, cy, r);
          const dist = Math.hypot(mx - v.x, my - v.y);
          if (dist < hitRadius && (!best || dist < best.dist)) best = { id: d.id, dist };
        }
        return best?.id ?? null;
      };

      const setValueAlongAxis = (id: DomainId, mx: number, my: number, cx: number, cy: number, r: number) => {
        const i = DOMAINS.findIndex((d) => d.id === id);
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / DOMAINS.length;
        const dx = mx - cx;
        const dy = my - cy;
        const proj = dx * Math.cos(a) + dy * Math.sin(a);
        const value = (proj / r) * 100;
        setDomain(id, value);
      };

      p.setup = () => {
        const c = p.createCanvas(containerRef!.clientWidth, containerRef!.clientHeight);
        c.parent(containerRef!);
      };

      p.windowResized = () => {
        if (!containerRef) return;
        p.resizeCanvas(containerRef.clientWidth, containerRef.clientHeight);
      };

      // Re-size when the host's box changes (mobile pane swap, sidebar collapse, orientation, etc.).
      resizeObs = new ResizeObserver(() => {
        if (!containerRef) return;
        p.resizeCanvas(containerRef.clientWidth, containerRef.clientHeight);
      });
      resizeObs.observe(containerRef!);

      // Returning false prevents the browser default — on touch this stops the page from scrolling under the drag.
      p.mousePressed = () => {
        const cx = p.width / 2;
        const cy = p.height / 2;
        const r = Math.min(p.width, p.height) * 0.36;
        const id = nearestDomain(p.mouseX, p.mouseY, cx, cy, r);
        // Always assign — including resetting to null on a miss-click — so a
        // stale draggingDomain from a prior gesture can't keep moving a vertex.
        draggingDomain = id;
        if (id) return false;
        return true;
      };

      p.mouseDragged = () => {
        if (!draggingDomain) return true;
        const cx = p.width / 2;
        const cy = p.height / 2;
        const r = Math.min(p.width, p.height) * 0.36;
        setValueAlongAxis(draggingDomain, p.mouseX, p.mouseY, cx, cy, r);
        return false;
      };

      p.mouseReleased = () => {
        draggingDomain = null;
      };

      p.mouseMoved = () => {
        const cx = p.width / 2;
        const cy = p.height / 2;
        const r = Math.min(p.width, p.height) * 0.36;
        hoverDomain = nearestDomain(p.mouseX, p.mouseY, cx, cy, r);
        containerRef!.style.cursor = hoverDomain ? 'grab' : 'default';
      };

      p.draw = () => {
        p.clear();
        const w = p.width;
        const h = p.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.36;
        t += 0.004;

        const n = DOMAINS.length;

        // guide rings
        p.noFill();
        p.stroke(210, 205, 215, 140);
        p.strokeWeight(1);
        for (const frac of [0.25, 0.5, 0.75, 1.0]) {
          p.circle(cx, cy, r * frac * 2);
        }

        // faint spokes
        p.stroke(220, 215, 225, 120);
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          p.line(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }

        const anchorsFor = (pf: CognitionProfile, wobble: number): Anchor[] =>
          DOMAINS.map((d, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
            const v = pf[d.id] ?? 0;
            const noise = (p.noise(i * 0.6, t) - 0.5) * wobble;
            const radius = (r * Math.max(0, Math.min(100, v + noise))) / 100;
            return { angle, radius };
          });

        const drawShape = (
          anchors: Anchor[],
          fill: [number, number, number, number],
          stroke: [number, number, number, number] | null,
        ) => {
          const pts = densePath(anchors, cx, cy, 18);
          p.fill(fill[0], fill[1], fill[2], fill[3]);
          if (stroke) {
            p.stroke(stroke[0], stroke[1], stroke[2], stroke[3]);
            p.strokeWeight(1.5);
          } else {
            p.noStroke();
          }
          p.beginShape();
          for (const pt of pts) p.vertex(pt.x, pt.y);
          p.endShape(p.CLOSE);
        };

        // Layer each active instrument as its own translucent green (#3BA181) veil — they stack to form the extended cognition.
        const active = activeInstruments();
        const activeList = instrumentsCache().filter((i) => active.has(i.id));
        for (const inst of activeList) {
          const layerProfile = applyLifts(profile, inst);
          drawShape(anchorsFor(layerProfile, 1.5), [59, 161, 129, 55], null);
        }

        // Outer edge — cumulative extension boundary (stroke-only for a clean rim)
        if (activeList.length > 0) {
          let cumulative = { ...profile } as CognitionProfile;
          for (const inst of activeList) cumulative = applyLifts(cumulative, inst);
          drawShape(anchorsFor(cumulative, 1.5), [59, 161, 129, 0], [40, 130, 100, 220]);
        }

        // Base shape — warm orange (#FFA95A) — the person's cognition
        drawShape(anchorsFor(profile, 1.2), [255, 169, 90, 200], [210, 120, 55, 240]);

        // Vertex handles for dragging
        for (let i = 0; i < n; i++) {
          const d = DOMAINS[i];
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const rr = (r * profile[d.id]) / 100;
          const vx = cx + Math.cos(a) * rr;
          const vy = cy + Math.sin(a) * rr;
          const highlighted =
            draggingDomain === d.id || hoverDomain === d.id;
          p.noStroke();
          p.fill(210, 120, 55, highlighted ? 255 : 180);
          p.circle(vx, vy, highlighted ? 12 : 8);
          if (highlighted) {
            p.fill(255, 255, 255, 240);
            p.circle(vx, vy, 4);
          }
        }

        // axis labels
        p.noStroke();
        p.fill(70);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const lx = cx + Math.cos(a) * (r + 34);
          const ly = cy + Math.sin(a) * (r + 34);
          p.text(DOMAINS[i].label, lx, ly);
        }
      };
    }, containerRef);
  });

  onCleanup(() => {
    instance?.remove();
    resizeObs?.disconnect();
  });

  return <div class="radar-host" ref={containerRef} />;
}
