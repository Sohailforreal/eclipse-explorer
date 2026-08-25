import { AnimatePresence, motion } from "framer-motion";
import NavButton from "./NavButton";
import AstroBust from "./AstroBust";
import { useAstro } from "../context/AstroContext";

export default function AstroBar({ onPrev, onNext, hasPrev, hasNext }) {
  const { astro } = useAstro();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-3 sm:px-6 pointer-events-none">
      <div className="max-w-lg mx-auto flex items-end justify-center gap-2 sm:gap-4">
        <div className="pointer-events-auto pb-1">
          <NavButton direction="prev" onClick={onPrev} disabled={!hasPrev} />
        </div>

        <div className="flex-1 flex flex-col items-center min-w-0 max-w-[16rem] sm:max-w-xs">
          <div className="pointer-events-auto -mb-8 z-10">
            <AstroBust mood={astro.mood} size={84} />
          </div>
          <div className="pointer-events-auto w-full bg-white/95 rounded-3xl pt-9 pb-3 px-4 shadow-lg min-h-[4.5rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {astro.message && (
                <motion.p
                  key={astro.message}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-space-900 font-body font-semibold text-xs sm:text-sm text-center leading-snug"
                >
                  {astro.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-auto pb-1">
          <NavButton direction="next" onClick={onNext} disabled={!hasNext} />
        </div>
      </div>
    </div>
  );
}