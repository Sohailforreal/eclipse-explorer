import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard, IconChip } from "../components/ui";

const NODES = {
  start: {
    emoji: "🏕️",
    text: "You and Astro are camping out for eclipse day! What do you pack first?",
    choices: [
      { label: "🥽 Eclipse glasses", next: "glasses" },
      { label: "📷 A camera", next: "camera" },
    ],
  },
  glasses: {
    emoji: "🥽🎒",
    text: "Smart choice! You pack your eclipse glasses safely in your bag. Where do you set up?",
    choices: [
      { label: "⛰️ On a hilltop", next: "hilltop" },
      { label: "🏖️ On the beach", next: "beach" },
    ],
  },
  camera: {
    emoji: "📷🎒",
    text: "Astro reminds you: never point a regular camera straight at the Sun! You grab eclipse glasses too, just in case. Where do you set up?",
    choices: [
      { label: "⛰️ On a hilltop", next: "hilltop" },
      { label: "🏖️ On the beach", next: "beach" },
    ],
  },
  hilltop: {
    emoji: "⛰️🔭",
    text: "From the hilltop, you can see for miles! The sky starts to dim...",
    choices: [
      { label: "⏳ Wait and watch", next: "ending" },
      { label: "🥽 Put on your glasses", next: "ending" },
    ],
  },
  beach: {
    emoji: "🏖️🌊",
    text: "The waves go quiet as the sky slowly darkens...",
    choices: [
      { label: "⏳ Wait and watch", next: "ending" },
      { label: "🥽 Put on your glasses", next: "ending" },
    ],
  },
};

function EndingScene() {
  return (
    <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, #FFB70355, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-space-900 shadow-[0_0_40px_18px_rgba(255,183,3,0.55)]" />
      </div>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute text-xl"
            style={{
              left: `${50 + Math.cos(angle) * 42}%`,
              top: `${50 + Math.sin(angle) * 42}%`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
          >
            ✨
          </motion.span>
        );
      })}
    </div>
  );
}

export default function Story() {
  const [nodeId, setNodeId] = useState("start");
  const node = NODES[nodeId];
  const isEnding = nodeId === "ending";
  const { setAstro } = useAstro();

useEffect(() => {
  setAstro(
    isEnding
      ? { mood: "cheer", message: "What an adventure! You're ready for the real thing." }
      : { mood: "thinking", message: "What will you choose?" }
  );
}, [isEnding, setAstro]);
  return (
    <div className="h-full w-full flex flex-col items-center justify-center pt-20 pb-48 px-4">
      <SectionTitle>Your Eclipse Adventure</SectionTitle>

      <GlassCard className="w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {isEnding ? (
            <motion.div
              key="ending"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <EndingScene />
              <p className="text-center font-body font-bold text-white">
                Totality! The sky goes dark, the corona glows, and everyone cheers. You just watched a total
                solar eclipse! 🎉
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={nodeId}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="text-6xl">{node.emoji}</div>
              <p className="text-center font-body font-semibold text-white text-sm sm:text-base">{node.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {!isEnding && (
        <div className="flex flex-col sm:flex-row gap-3 mt-5 w-full max-w-sm">
          {node.choices.map((c) => (
            <IconChip key={c.label} onClick={() => setNodeId(c.next)} className="flex-1">
              {c.label}
            </IconChip>
          ))}
        </div>
      )}

      
      {isEnding && (
        <button
          onClick={() => setNodeId("start")}
          className="mt-3 font-body text-white/60 text-xs underline"
        >
          Play again with different choices
        </button>
      )}
    </div>
  );
}
