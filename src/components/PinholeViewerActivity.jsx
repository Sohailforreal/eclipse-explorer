import { Suspense, lazy, useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CanvasSkeleton } from "../components/CanvasSkeleton";
import { GlassCard } from "../components/ui";

// Code-split: the whole @react-three/fiber Canvas + model bundle only
// downloads once this section is actually rendered, not on initial page load.
const PinholeViewerModel = lazy(() => import("../three/PinholeViewerModel"));

const STEPS = [
  {
    title: "Step 1 • Open the Box",
    text: "Take a long cardboard or shoe box and open the top flap."
  },
  {
    title: "Step 2 • Paste White Paper",
    text: "Tape a white sheet of paper inside the back wall of the box. This is the screen where the eclipse will appear."
  },
  {
    title: "Step 3 • Make the Pinhole",
    text: "Cover the front opening with aluminum foil and poke one tiny pinhole in the center."
  },
  {
    title: "Step 4 • Cut the View Port",
    text: "Cut a small viewing window on the side of the box so you can look inside."
  },
  {
    title: "Step 5 • Watch the Eclipse Safely",
    text: "Stand with your back to the Sun. Sunlight enters through the pinhole and projects the eclipse onto the white paper."
  }
];

// Only mounts the 3D canvas once this section actually scrolls into view —
// avoids paying the WebGL/context cost for a section the user hasn't reached yet.
function useInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only need to trigger once
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

export default function PinholeViewerActivity() {
  const [step, setStep] = useState(0);
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div ref={wrapperRef} className="w-full max-w-md mt-6">
      <GlassCard className="p-4">
        <h3 className="text-yellow-300 font-bold text-lg mb-1 text-center">
          🔨 Build Your Own Pinhole Viewer
        </h3>
        <p className="text-white/60 text-xs text-center mb-4">
          Tap Next to watch it come together!
        </p>

        <div
          className="relative w-full h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-indigo-950 to-slate-950"
          style={{ contain: "layout size" }}
        >
          {inView && (
            <>
              <Canvas
                camera={{ position: [1.2, 1.4, 1.8], fov: 40 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 1.5]} // capped — this model doesn't need retina-sharp detail
                resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
              >
                <ambientLight intensity={0.8} />
                <pointLight position={[2, 3, 2]} intensity={1.2} />

                <Suspense fallback={null}>
                  <PinholeViewerModel step={step} />
                </Suspense>

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.8}
                />
              </Canvas>

              <CanvasSkeleton />
            </>
          )}
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-yellow-400" : "w-2 bg-white/25"
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Step text */}
        <div className="text-center mt-3 min-h-[52px]">
          <p className="text-white font-semibold text-sm">
            {STEPS[step].title}
          </p>
          <p className="text-white/70 text-xs mt-1 leading-5">
            {STEPS[step].text}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mt-4">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={step === STEPS.length - 1}
            className="flex-1 py-2 rounded-xl bg-yellow-400 text-indigo-950 text-sm font-bold disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
