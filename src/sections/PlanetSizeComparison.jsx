import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard } from "../components/ui";
import { useImagePreload } from "../hooks/useImagePreload";

const SUN_REAL_SRC = "/images/sun_real.jpeg";
const SUN_EARTHS_SRC = "/images/sun_earths.jpeg";

const TOTAL_EARTHS = 1300000;

export default function PlanetSizeComparison() {
  const { setAstro } = useAstro();

  const [reveal, setReveal] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [factUnlocked, setFactUnlocked] = useState(false);

  const imagesLoaded = useImagePreload(
    useMemo(() => [SUN_REAL_SRC, SUN_EARTHS_SRC], [])
  );

  const handleReveal = useCallback((value) => {
    setReveal(value);
  }, []);

  // Live Earth counter
  const earthCount = Math.round((reveal / 100) * TOTAL_EARTHS);
  const formattedCount = new Intl.NumberFormat("en-IN").format(earthCount);

  useEffect(() => {
    setAstro({
      mood: "excited",
      message: "Slide to see how HUGE the Sun really is! ☀️",
    });
  }, [setAstro]);

  useEffect(() => {
    if (reveal >= 90 && !factUnlocked) {
      setAstro({
        mood: "excited",
        message: "Whoa! The Sun is bigger than you can imagine!",
      });
      setShowFact(true);
      setFactUnlocked(true);
    }
  }, [reveal, factUnlocked, setAstro]);

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub="Slide to reveal how big the Sun is next to Earth!">
        How Big is the Sun?
      </SectionTitle>

      {/* Image Reveal Card */}
      <GlassCard className="w-full max-w-sm p-4">
        <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden">
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-400/40 border-t-yellow-400 animate-spin" />
            </div>
          )}

          <img
            src={SUN_REAL_SRC}
            alt="Sun"
            draggable={false}
            loading="eager"
            decoding="async"
            className="absolute top-0 left-0 w-72 h-72 object-cover select-none pointer-events-none"
            style={{ opacity: imagesLoaded ? 1 : 0 }}
          />

          <img
            src={SUN_EARTHS_SRC}
            alt="Sun with Earths"
            draggable={false}
            loading="eager"
            decoding="async"
            className="absolute top-0 left-0 w-72 h-72 object-cover select-none pointer-events-none"
            style={{
              clipPath: `inset(0 ${100 - reveal}% 0 0)`,
              opacity: imagesLoaded ? 1 : 0,
            }}
          />

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
            style={{
              left: `${reveal}%`,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        <div className="mt-6">
          <input
            type="range"
            min="0"
            max="100"
            value={reveal}
            onChange={(e) => handleReveal(Number(e.target.value))}
            className="w-full accent-yellow-400"
          />

          <div className="flex justify-between text-white/60 text-xs mt-1">
            <span>Earth</span>
            <span>Sun</span>
          </div>
        </div>
      </GlassCard>

      {/* Live Earth Counter */}
      <GlassCard className="w-full max-w-sm mt-5 p-5">
        <div className="text-center">
          <p className="text-white/70 text-sm mb-2">
            🌍 Earths that could fit inside the Sun
          </p>

          <h2 className="text-4xl font-extrabold text-yellow-300">
            {formattedCount}
          </h2>

          <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-300 to-orange-400 transition-all duration-300"
              style={{ width: `${reveal}%` }}
            />
          </div>

          <p className="text-white/60 text-xs mt-3 leading-5">
            At 100%, about{" "}
            <span className="text-yellow-300 font-semibold">
              13,00,000 Earths
            </span>{" "}
            could fit inside the Sun.
          </p>
        </div>
      </GlassCard>

      {/* Fact Popup */}
      <AnimatePresence>
        {showFact && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-indigo-900 to-indigo-950 border border-white/10 p-6 text-center shadow-2xl"
            >
              <div className="text-5xl mb-3">🌞</div>

              <h3 className="text-yellow-300 font-extrabold text-xl mb-2">
                Space Fact Unlocked!
              </h3>

              <p className="text-white/90 text-sm leading-6">
                NASA estimates that about{" "}
                <span className="text-yellow-300 font-bold">
                  1.3 million Earth-sized planets
                </span>{" "}
                could fit inside the Sun.
              </p>

              <button
                onClick={() => setShowFact(false)}
                className="mt-5 w-full py-3 rounded-2xl bg-yellow-400 text-indigo-950 font-extrabold text-base shadow-lg active:scale-95 transition-transform"
              >
                Amazing!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}