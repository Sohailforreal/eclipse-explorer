import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { EclipseSun, EclipseMoon } from "../three/bodies"; // with this one
import { useAstro } from "../context/AstroContext";
import { SectionTitle, BigButton, GlassCard } from "../components/ui";
import { CanvasSkeleton } from "../components/CanvasSkeleton";
import { useImagePreload } from "../hooks/useImagePreload";

const SOLAR_GIF_SRC = "/gifs/solar-eclipse.gif";
const SUN_BASE_RADIUS = 0.55;
const MOON_BASE_RADIUS = 0.55;
const TARGET_RADIUS = 0.52; // both bodies render at this same apparent size

const sunScale = TARGET_RADIUS / SUN_BASE_RADIUS;   
const moonScale = TARGET_RADIUS / MOON_BASE_RADIUS; 

// ---------- Sky gradient helper ----------
function lerpColor(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

function getSkyGradient(aligned) {
  const dayTop = "#4FA8E8";       // Same bright blue theme
  const dayBottom = "#BEE3F8";

  const eclipseTop = "#020208";
const eclipseBottom = "#0D0A1F";

  return `linear-gradient(
    to bottom,
    ${lerpColor(dayTop, eclipseTop, aligned)} 0%,
    ${lerpColor(dayBottom, eclipseBottom, aligned)} 100%
  )`;
}
// ---------- Earth-view 3D scene ----------

function EarthViewScene({ progress, aligned }) {
  const moonX = THREE.MathUtils.lerp(-1.6, 1.6, progress);
  const moonY = THREE.MathUtils.lerp(-0.3 - 0.15, 1.15 - 0.2, progress); // diagonal path

  const sunX = 0;
  const sunY = 0.35;

  return (
    <>
      <ambientLight intensity={0.15 + (1 - aligned) * 0.3} />
      <pointLight position={[sunX, sunY, 2]} intensity={8} color="#FFFFFF" />

      <EclipseSun position={[sunX, sunY, -1]} scale={sunScale} />
      <EclipseMoon
        position={[moonX, moonY, 0.2]}
        scale={moonScale}
        aligned={aligned}
      />
    </>
  );
}
// ---------- Slider ----------
function EclipseSlider({ progress, onChange, onDragStart }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const update = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    onDragStart?.();
    onChange(x / rect.width);
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        setDragging(true);
        onDragStart?.();
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging && update(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      className="relative w-full h-2 rounded-full bg-white/20 touch-none"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-yellow-400"
        style={{ width: `${progress * 100}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 border border-white shadow-lg"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}

// ---------- Main component ----------
export default function SolarSimulator() {
  const { setAstro } = useAstro();

  const [phase, setPhase] = useState("intro");
  const [progress, setProgress] = useState(0);
  const [showEarthButton, setShowEarthButton] = useState(false);
  const [showFinger, setShowFinger] = useState(false);

  const gifLoaded = useImagePreload(useMemo(() => [SOLAR_GIF_SRC], []));

  const eclipseType =
    progress >= 0.45 && progress <= 0.55
      ? "total"
      : progress >= 0.25 && progress <= 0.65
      ? "partial"
      : "none";

  const rawAligned = 1 - Math.min(1, Math.abs(progress - 0.5) / 0.32);
const aligned = rawAligned * rawAligned * (3 - 2 * rawAligned);
  useEffect(() => {
    if (phase === "intro") {
      setAstro({
        mood: "thinking",
        message: "Tap to see how a Solar Eclipse happens!",
      });
    } else if (phase === "playing") {
      setAstro({
        mood: "happy",
        message: "Watch the Solar Eclipse animation!",
      });

      const timer = setTimeout(() => setShowEarthButton(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setAstro({
        mood: "excited",
        message: "Move the Moon to create a Solar Eclipse!",
      });
    }
  }, [phase, setAstro]);

  useEffect(() => {
    if (phase === "earth") {
      setShowFinger(true);
      const timer = setTimeout(() => setShowFinger(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleReset = () => {
    setPhase("intro");
    setProgress(0);
    setShowEarthButton(false);
    setShowFinger(false);
  };

  return (
   <div className="relative h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
    <div
  className="pointer-events-none absolute w-full inset-0"
  style={{ background: "black", opacity: aligned * 0.75 }}
/>
    <div className="relative z-10 w-full flex flex-col items-center">
      <SectionTitle>Solar Eclipse Simulator</SectionTitle>

      <GlassCard className="w-full max-w-md p-2 mt-2">
        <div
          className="relative w-full h-[300px] rounded-3xl overflow-hidden"
          style={{ contain: "layout size" }}
        >
          {phase === "earth" ? (
            <>
              {/* Sky background — ONLY this inner card darkens with the slider */}
              <div
                className="absolute inset-0 transition-[background] duration-500"
                style={{ background: getSkyGradient(aligned) }}
              />

                <Canvas
                  camera={{ position: [0, 0, 3.3], fov: 34 }}
                  gl={{ alpha: true }}
                  resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
                >
                  <Suspense fallback={null}>
                    <EarthViewScene progress={progress} aligned={aligned} />
                  </Suspense>
                </Canvas>

                <CanvasSkeleton />
              </>
            ) : (
              <>
                {!gifLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-950 via-black to-slate-900 z-10">
                    <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
                    <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-1/2 bg-yellow-400 animate-pulse" />
                    </div>
                  </div>
                )}

                <img
                  src={SOLAR_GIF_SRC}
                  alt="Solar Eclipse"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: gifLoaded ? 1 : 0 }}
                  loading="eager"
                  decoding="async"
                />

                {phase === "intro" && gifLoaded && (
                  <div
                    onClick={() => setPhase("playing")}
                    className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer"
                  >
                    <div className="px-5 py-2 rounded-full bg-yellow-400 text-black font-bold">
                      🌑 Tap to See Solar Eclipse
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </GlassCard>

        {phase === "playing" && showEarthButton && (
          <BigButton
            color="sunny"
            className="mt-5 w-full max-w-md"
            onClick={() => setPhase("earth")}
          >
            🌍 Explore Earth View
          </BigButton>
        )}

        {phase === "earth" && (
          <>
            <GlassCard className="w-full max-w-md mt-5 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-yellow-300 font-semibold text-sm">
                  🌙 Move the Moon
                </p>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold"
                >
                  🔄 Reset
                </button>
              </div>

              <div className="relative mb-4 px-1">
                <div className="flex justify-between text-[10px] text-white/60 mb-2">
                  <span>☀️</span>
                  <span className="text-orange-300">🌘</span>
                  <span className="text-yellow-300">🌑</span>
                  <span className="text-orange-300">🌘</span>
                  <span>☀️</span>
                </div>
              </div>

              <div className="relative">
                <EclipseSlider
                  progress={progress}
                  onChange={setProgress}
                  onDragStart={() => setShowFinger(false)}
                />

                {showFinger && (
                  <img
                    src="/images/astronaut-finger.png"
                    alt="Swipe tutorial"
                    className="swipe-finger absolute w-16 pointer-events-none"
                    style={{ top: "62%", "--finger-x": "-120px" }}
                  />
                )}
              </div>
            </GlassCard>

            <GlassCard className="w-full max-w-md mt-5 p-5 text-center">
              {eclipseType === "total" && (
                <>
                  <h3 className="text-yellow-300 text-xl font-bold mb-2">
                    🌑 Total Solar Eclipse
                  </h3>
                  <p className="text-white/80 text-sm leading-6">
                    Amazing! The Moon completely covers the Sun, so the sky
                    becomes dark for a short time.
                  </p>
                </>
              )}

              {eclipseType === "partial" && (
                <>
                  <h3 className="text-orange-300 text-xl font-bold mb-2">
                    🌘 Partial Solar Eclipse
                  </h3>
                  <p className="text-white/80 text-sm leading-6">
                    Great! The Moon covers only part of the Sun, so some
                    sunlight is still visible.
                  </p>
                </>
              )}

              {eclipseType === "none" && (
                <>
                  <h3 className="text-white text-xl font-bold mb-2">
                    ☀️ No Eclipse Yet
                  </h3>
                  <p className="text-white/70 text-sm leading-6">
                    Keep sliding the Moon until it lines up with the glowing
                    Sun.
                  </p>
                </>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}
