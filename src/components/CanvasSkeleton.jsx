import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export function CanvasSkeleton({ className = "" }) {
  const { active, progress } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-950 via-black to-slate-900 z-10 ${className}`}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}