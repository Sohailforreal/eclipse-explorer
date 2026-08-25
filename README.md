# Eclipse Explorer 🌘

An interactive space-adventure web app that teaches Class 3 kids (ages 7–9) about
solar and lunar eclipses. Built with React, Three.js (`@react-three/fiber`),
Tailwind CSS, and Framer Motion. Zero external image/texture assets — every
planet/mascot is drawn procedurally so it runs anywhere with no missing files.

## Sections (in order)

1. Welcome — rotating 3D Sun/Earth/Moon, Astro waves hello
2. Meet the Sun, Earth & Moon — tappable, draggable 3D models + facts
3. Orbits — play/pause, turtle/rabbit speed, drag the Moon along its orbit
4. What is an eclipse? — flashlight-and-ball shadow analogy
5. Solar eclipse simulator — drag the Moon, space/Earth view toggle, 3 sub-types
6. Lunar eclipse simulator — same engine reversed (Blood Moon!)
7. How often — spinning year wheel
8. Safety — mini story + drag-and-drop "Safe or Not Safe?" game
9. Interactive story — choose-your-own-adventure, 3 tap decisions
10. Quiz — 9 mixed questions (multiple choice, true/false, drag-match, mini-sim),
    confetti, and an animated "Eclipse Explorer" badge finale

## Running on Termux (Android)

```bash
# unzip the project, then:
cd eclipse-explorer
npm install
npm run dev -- --host
```

Vite will print a URL like `http://192.168.x.x:5173` — open that in Chrome on
your phone (or any device on the same Wi-Fi).

To build a production bundle you can host anywhere (e.g. Netlify, GitHub Pages,
Vercel, or a static file server):

```bash
npm run build      # outputs to dist/
npm run preview -- --host   # serve the production build locally to test it
```

## Notes for further work

- `src/three/bodies.jsx` — Sun/Earth/Moon meshes with procedurally generated
  canvas textures (no external image files needed). Swap in real NASA
  textures later by replacing the `useMemo` texture generators with
  `useLoader(THREE.TextureLoader, "/textures/earth.jpg")`.
- `src/components/Astro.jsx` — the mascot is pure SVG + Framer Motion, so
  expressions/poses are easy to extend (see the `FACES` map).
- Currently there's no sound (marked as nice-to-have in the brief). To add
  mute-able ambient sound, drop an mp3 in `public/` and wire up an `<audio>`
  element controlled from `App.jsx`.
- The JS bundle is ~1.3MB (mostly three.js) — fine for a v1, but consider
  lazy-loading heavier sections (`React.lazy`) if you want a faster first paint.
