import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneProvider } from "./context/SceneContext";
import SceneCanvasPortal from "./components/SceneCanvasPortal";

import Starfield from "./components/Starfield";
import ProgressBar from "./components/ProgressBar";
import AstroBar from "./components/AstroBar";
import { AstroProvider } from "./context/AstroContext";
import PlanetSizeComparison from "./sections/PlanetSizeComparison";
import Welcome from "./sections/Welcome";
import MeetThePlanets from "./sections/MeetThePlanets";
import Orbits from "./sections/Orbits";
import WhatIsEclipse from "./sections/WhatIsEclipse";
import SolarSimulator from "./sections/SolarSimulator";
import LunarSimulator from "./sections/LunarSimulator";
import Safety from "./sections/Safety";
import Story from "./sections/Story";
import Quiz from "./sections/Quiz";
import { Suspense } from "react";
import { useProgress } from "@react-three/drei";

import { preloadAllTextures } from "./utils/preloadAssets";
preloadAllTextures();

function Loader() {
  const { progress } = useProgress();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
      Loading the solar system... {progress.toFixed(0)}%
    </div>
  );
}

const SECTIONS = [
  Welcome,
  MeetThePlanets,
  PlanetSizeComparison,
  Orbits,
  WhatIsEclipse,
  SolarSimulator,
  LunarSimulator,
  
  Safety,
  Story,
  Quiz,
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 1,
  }),
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [maxReached, setMaxReached] = useState(0);
  useEffect(() => {
  const audio = new Audio("/audio/eclipse-intro-voiceover.mp3");
  audio.preload = "auto";
  audio.load();
}, []);

  const goTo = (index) => {
    if (index < 0 || index >= SECTIONS.length) return;

    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setMaxReached((prev) => Math.max(prev, index));
  };
  

  const Section = SECTIONS[current];

  return (
    <SceneProvider>
    <AstroProvider>
      <div className="relative h-[100dvh] w-full overflow-hidden font-body">
        {/* Animated star background */}
        <div className="absolute inset-0 z-0">
          <Starfield />
          <Suspense fallback={<Loader />}>
          <SceneCanvasPortal />
          </Suspense>
        </div>

        {/* Progress Bar */}
        <div className="relative z-30">
          <ProgressBar
            current={current}
            total={SECTIONS.length}
            onJump={(i) => i <= maxReached && goTo(i)}
          />
        </div>

        {/* Sliding Sections */}
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: "easeInOut", duration: 0.45 },
            }}
            className="absolute inset-0 z-10"
          >
            <Section onNext={() => goTo(current + 1)} />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Astro Navigation */}
        <div className="relative z-30">
          <AstroBar
            onPrev={() => goTo(current - 1)}
            onNext={() => goTo(current + 1)}
            hasPrev={current > 0}
            hasNext={current < SECTIONS.length - 1}
          />
        </div>
      </div>
    </AstroProvider>
    </SceneProvider>
      
      
  );
}