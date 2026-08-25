import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAstro } from "../context/AstroContext";
import { BigButton } from "../components/ui";

export default function Welcome({ onNext }) {
  const { setAstro } = useAstro();

  useEffect(() => {
    setAstro({
      mood: "excited",
      message: "Hi! I'm Astro. Ready to explore eclipses with me?",
    });
  }, [setAstro]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center pb-48 px-4 overflow-hidden">
      {/* Twinkle dot accent, like top-right of reference */}
      <motion.div
        className="absolute w-2.5 h-2.5 rounded-full bg-teal-300"
        style={{ top: "34%", right: "8%" }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative"
      >
        <h1
          className="font-display font-extrabold leading-[0.92] tracking-tight"
          style={{
            color: "#FFF8ED",
            textShadow: `
              0 2px 0 #2A1768,
              0 4px 0 #2A1768,
              0 6px 0 #2A1768,
              0 8px 0 #2A1768,
              0 10px 14px rgba(0,0,0,0.35)
            `,
          }}
        >
          <span className="block text-5xl sm:text-7xl">Eclipse</span>
          <span className="block text-5xl sm:text-7xl">Explorer</span>
        </h1>

        {/* Hand-drawn style pink underline */}
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          viewBox="0 0 320 20"
          className="w-56 sm:w-72 h-4 mx-auto mt-1"
          fill="none"
        >
          <motion.path
            d="M6 12 C 90 4, 230 4, 314 10"
            stroke="#FF6F91"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </motion.svg>

        <p className="font-body text-sm sm:text-lg mt-5">
          <span className="text-white/60">A space adventure about the </span>
          <span className="text-white font-bold">Sun, Earth &amp; Moon.</span>
        </p>
      </motion.div>

      <BigButton
        color="sunny"
        onClick={onNext}
        className="mt-8 w-full max-w-xs mx-auto py-1"
      >
        Start My Space Adventure
      </BigButton>
    </div>
  );
}
