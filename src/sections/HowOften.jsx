import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAstro } from "../context/AstroContext";
import { SectionTitle } from "../components/ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// A representative (illustrative, not exact-year) pattern of a few eclipses across a year
const EVENTS = [
  { month: 1, type: "lunar" },
  { month: 3, type: "solar" },
  { month: 6, type: "lunar" },
  { month: 8, type: "solar" },
  { month: 10, type: "lunar" },
];

export default function HowOften() {
  const [spin, setSpin] = useState(0);
  const radius = 105;
  const center = 130;

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub="Eclipses aren't rare — they happen a few times every year!">How Often?</SectionTitle>

      <motion.button
        onClick={() => setSpin((s) => s + 1)}
        animate={{ rotate: spin * 360 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="relative w-64 h-64 sm:w-72 sm:h-72"
        aria-label="Spin the year wheel"
      >
        <svg viewBox="0 0 260 260" className="w-full h-full drop-shadow-xl">
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#ffffff22" strokeWidth="26" />
          {MONTHS.map((m, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return (
              <text
                key={m}
                x={x}
                y={y}
                fill="#ffffffaa"
                fontSize="10"
                fontFamily="Quicksand"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {m}
              </text>
            );
          })}
          {EVENTS.map((ev, i) => {
            const angle = (ev.month / 12) * Math.PI * 2 - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return (
              <text key={i} x={x} y={y} fontSize="20" textAnchor="middle" dominantBaseline="middle">
                {ev.type === "solar" ? "☀️" : "🌕"}
              </text>
            );
          })}
          <circle cx={center} cy={center} r="34" fill="#FFD166" />
          <text x={center} y={center + 5} fontSize="24" textAnchor="middle">🌍</text>
        </svg>
      </motion.button>
      <p className="text-white/60 font-body text-xs sm:text-sm mt-1">👆 Tap the Earth to spin the year!</p>

      <div className="flex gap-6 mt-4 font-body text-sm text-white/80">
        <span>☀️ Solar eclipse</span>
        <span>🌕 Lunar eclipse</span>
      </div>

      
    </div>
  );
}
