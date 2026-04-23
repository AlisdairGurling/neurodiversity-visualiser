# Neurodiversity Visualiser

A strengths-based portrait of cognition, extended by **Instruments of Change**.

Import an Educational Psychologist report — or describe a learner's cognition in your own words — and watch a soft, organic shape emerge across ten cognitive and functional domains. Then layer in instruments of change (digital prosthetics, mind-body strategies, relational supports, space-making) and see how the shape extends. The visualiser is designed to hold cognition as **distributed, extended, and relational** rather than deficit-laden, individual, and bounded.

Live: [visualiser.neurodiversity.tools](https://visualiser.neurodiversity.tools)

## Why it looks the way it does

The visualiser is a creative output of ongoing doctoral research into neurodivergent learning and the design of encounters that shift how learners relate to cognitive support. It tries to **perform** the argument that a thesis makes in words: cognition is not a ring-fenced number inside a single skull, and the instruments we reach for are legitimate extensions of it.

Two visual commitments:

- **Warm orange inside, cool green around it.** The orange shape is the learner's cognition as described. Each active instrument lays a translucent green veil over the top — so the extended cognition is built up, layer by layer, as new instruments arrive.
- **The shape is soft.** Spider diagrams with hard angles make cognition look like a measurement. A spline-smoothed, gently breathing outline lets it look like what it is: a living configuration.

## Instruments of Change

Organised in four categories, not siloed — they act in concert:

- **Digital prosthetics** — text-to-speech, mind-mapping, calculators, task managers.
- **Mind-body strategies** — breathwork, movement, noticing-and-naming.
- **Relational instruments** — peer reflection, collective sense-making.
- **Space-making** — noise-calmed spaces, rhizomatic pedagogy.

Each instrument carries a **Tool Line marker** (accepted / contested / stigmatised) — a reminder that the boundary between "legitimate" and "not-quite-legitimate" cognitive extensions is culturally constructed, and moves.

## Features

- Soft radar across 10 domains with strengths-based labels; Wechsler / WIAT terms and academic citations accessible on click.
- **Drag a radar vertex** to reshape the cognition directly.
- **Drag an instrument onto the shape** to layer it in; multiple instruments stack as distinct translucent veils.
- **PDF drop** — extract Wechsler indices (WISC-V / WAIS) and WIAT composites from an EP report via `pdf.js`.
- **Free-text extraction** — paste a written description of someone's cognition; Claude returns a structured profile (requires your own Anthropic API key, stored in your browser only).
- **Export PNG** and **Copy share link** (encodes the profile + active instruments into a URL hash).
- Pluggable instruments data source — the palette reads from a provider interface so it can later be backed by a live `neurodiversity.tools` database rather than the bundled starter set.

## Running locally

```sh
npm install
npm run dev
```

Opens on [localhost:5173](http://localhost:5173).

Build for production with `npm run build` — output goes to `dist/`.

## Stack

- Vite + Solid.js + TypeScript for the reactive shell.
- p5.js (instance mode) for the organic drawing.
- pdf.js for client-side PDF text extraction (no upload — everything stays in the browser).
- Anthropic SDK-compatible direct browser calls for the free-text extractor.

Deployed as a static site on Netlify.

## Credit

A project by **Alisdair Gurling**, as part of ongoing doctoral research into neurodivergent learning and instruments of change. The theoretical vocabulary — instruments of change, the Tool Line, brute force / sidestep / leapfrog, the Dyslexic Room, the SEAT framework, "new divergent cognition" — is developed in that thesis.
