import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard } from "../components/ui";
import PinholeViewerActivity from "../components/PinholeViewerActivity";

const SAFETY_CARDS = [
  {
    id: 1,
    title: "Wear Eclipse Glasses",
    icon: "/images/safety-glasses.png",
    color: "border-yellow-400/40 bg-yellow-400/10",
    text: "Use certified solar eclipse glasses. Sunglasses are NOT safe.",
  },
  {
    id: 2,
    title: "Never Look Directly at the Sun",
    icon: "/images/no-look-sun.png",
    color: "border-red-400/40 bg-red-400/10",
    text: "Looking directly at the Sun can seriously damage your eyes.",
  },
  {
    id: 3,
    title: "Use a Pinhole Viewer",
    icon: "/images/pinhole-viewer.png",
    color: "border-blue-400/40 bg-blue-400/10",
    text: "A pinhole viewer lets you watch the eclipse safely without looking at the Sun.",
  },
  {
    id: 4,
    title: "Don't Use Cameras or Binoculars",
    icon: "/images/no-binoculars.png",
    color: "border-pink-400/40 bg-pink-400/10",
    text: "Never look through binoculars, telescopes, or a camera without a proper solar filter.",
  },
];

function SafetyCardSlider() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index];
    if (card) {
      track.scrollTo({ left: card.offsetLeft - 8, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - 8 - scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  };

  return (
    <div className="w-full max-w-md">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SAFETY_CARDS.map((card) => (
          <GlassCard
            key={card.id}
            className={`flex-shrink-0 w-[82%] snap-center p-4 border ${card.color}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={card.icon}
                alt={card.title}
                className="w-12 h-12 object-contain"
              />
              <span className="text-white font-semibold text-left leading-tight">
                {card.title}
              </span>
            </div>
            <p className="text-white/75 text-sm leading-6">{card.text}</p>
          </GlassCard>
        ))}
      </div>

      {/* Dot indicators + tap-to-jump */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {SAFETY_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-yellow-400" : "w-2 bg-white/25"
            }`}
            aria-label={`Safety tip ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function SafetyFirst() {
  const { setAstro } = useAstro();
  const [checks, setChecks] = useState([false, false, false]);

  useEffect(() => {
    setAstro({
      mood: "thinking",
      message: "Your eyes are precious! Let's learn how to watch an eclipse safely. 😎",
    });
  }, [setAstro]);

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub="Protect your eyes before watching a Solar Eclipse!">
        Safety First
      </SectionTitle>

      {/* Hero Safety Card */}
      <GlassCard className="w-full max-w-md p-5 mb-5">
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/eclipse-glasses-hero.png"
            alt="Eclipse Glasses"
            className="w-28 h-28 object-contain mb-3"
          />

          <h3 className="text-yellow-300 font-bold text-xl mb-2">
            Always Protect Your Eyes!
          </h3>

          <p className="text-white/80 text-sm leading-6">
            A Solar Eclipse is beautiful, but looking at the Sun without protection can hurt your eyes.
          </p>
        </div>
      </GlassCard>

      {/* Swipeable Safety Card Slider */}
      <SafetyCardSlider />

      <PinholeViewerActivity />
      
      {/* Mini Safety Checklist */}
      <GlassCard className="w-full max-w-md mt-6 p-5">
        <h3 className="text-green-300 font-bold text-lg mb-3">
          ✅ Eclipse Safety Checklist
        </h3>

        {[
          "I have eclipse glasses.",
          "I will never look directly at the Sun.",
          "I know how to use a pinhole viewer.",
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => {
              const next = [...checks];
              next[index] = !next[index];
              setChecks(next);
            }}
            className="w-full flex items-center gap-3 py-2"
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                checks[index]
                  ? "bg-green-400 border-green-400"
                  : "border-white/40"
              }`}
            >
              {checks[index] && <span className="text-black text-xs">✔</span>}
            </div>

            <span className="text-white/90 text-sm">{item}</span>
          </button>
        ))}

        {checks.every(Boolean) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-2xl bg-green-500/15 border border-green-400/30 p-4 text-center"
          >
            <p className="text-green-300 font-bold">
              🎉 Great Job, Space Explorer!
            </p>

            <p className="text-white/70 text-sm mt-1">
              You're ready to watch a Solar Eclipse safely.
            </p>
          </motion.div>
        )}
      </GlassCard>

      {/* Hands-on build activity — lazy-loaded 3D, only mounts once scrolled into view */}
      
    </div>
  );
}
