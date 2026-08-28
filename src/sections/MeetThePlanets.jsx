import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrbitControls } from "@react-three/drei";
import { Sun, Earth, Moon, TwinkleStars } from "../three/bodies";
import { SectionTitle, IconChip, GlassCard } from "../components/ui";
import { CanvasSkeleton } from "../components/CanvasSkeleton";
import { useAstro } from "../context/AstroContext";
import { useScene, useSceneSlot } from "../context/SceneContext";

const DISPLAY_RADIUS = 1.15;
const BASE_RADIUS = { sun: 1, earth: 0.7, moon: 0.48 };
const bodyScale = (key) => DISPLAY_RADIUS / BASE_RADIUS[key];

const BODIES = {
  sun: {
    label: "Sun",
    emoji: "☀️",
    facts: [
      "The Sun is a star. It is the biggest object in our solar system.",
      "The Sun affects Earth's weather, seasons, climate, and more.",
    ],
    astro: "The Sun is our star — it gives us light and warmth!",
  },
  earth: {
    label: "Earth",
    emoji: "🌍",
    facts: [
      "Earth is our home planet.",
      "It is covered with oceans, clouds and life.",
    ],
    astro: "That's Earth — where you live! It's mostly covered in water.",
  },
  moon: {
    label: "Moon",
    emoji: "🌙",
    facts: [
      
      "Moon orbit around Earth every month.",
      "It does not shine with its own light. It simply reflects light coming from the Sun.",
    ],
    astro: "The Moon is Earth's best friend, always following it around!",
  },
};

export default function MeetThePlanets() {
  const [active, setActive] = useState("sun");
  const [showFinger, setShowFinger] = useState(true);

  const { setAstro } = useAstro();
  const { setScene, setCamera } = useScene();
  const slotRef = useSceneSlot();

  const body = BODIES[active];

  useEffect(() => {
    setAstro({ mood: "happy", message: body.astro });
  }, [active, body, setAstro]);

  // Finger tutorial disappears after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowFinger(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCamera({ position: [0, 0, 4.5], fov: 40 });

    setScene(
      <Suspense fallback={null}>
        <ambientLight intensity={1.4} />
        <pointLight position={[4, 3, 4]} intensity={2.5} />
        <pointLight position={[-4, -2, 2]} intensity={1.2} color="#87CEFF" />

        <TwinkleStars count={180} radius={14} />

        {active === "sun" && <Sun scale={bodyScale("sun")} />}
        {active === "earth" && <Earth scale={bodyScale("earth")} />}
        {active === "moon" && <Moon scale={bodyScale("moon")} />}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          onStart={() => setShowFinger(false)}
        />
      </Suspense>
    );

    return () => setScene(null);
  }, [active, setScene, setCamera]);

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub="Tap any Celestial Body to explore it, then drag your finger to spin it around in 3D!">
        Meet the Trio
      </SectionTitle>

      <div className="flex gap-2 sm:gap-3 mb-5">
        {Object.entries(BODIES).map(([key, b]) => (
          <IconChip
            key={key}
            active={active === key}
            onClick={() => setActive(key)}
          >
            {b.emoji} {b.label}
          </IconChip>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full max-w-md h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-black to-slate-900 shadow-[0_0_60px_rgba(255,255,255,0.15)]">
        <div ref={slotRef} className="absolute inset-0 touch-none" />
        <CanvasSkeleton />

        {/* Swipe / Rotate Finger Tutorial */}
        {showFinger && (
          <img
            src="/images/astronaut-finger.png"
            alt="Rotate tutorial"
            className="swipe-finger absolute w-16 pointer-events-none z-20"
            style={{
              top: "68%",
              left: "12%",
              "--finger-x": "120px",
            }}
          />
        )}
      </div>

      {/* Facts */}
      <GlassCard className="w-full max-w-md mt-5 p-4">
        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-2"
          >
            {body.facts.map((fact, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-white text-sm sm:text-base font-semibold"
              >
                <span>•</span>
                <span>{fact}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}