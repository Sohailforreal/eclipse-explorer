import { useState, useEffect, useRef } from "react";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard, IconChip } from "../components/ui";

export default function WhatIsEclipse() {
  const { setAstro } = useAstro();
  const [mode, setMode] = useState("solar");
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setAstro({
      mood: "excited",
      message:
        mode === "solar"
          ? "The Moon blocks the Sun's light and its shadow falls on Earth! ☀️🌑🌍"
          : "The Earth blocks the Sun's light and its shadow falls on the Moon! 🌍🌕",
    });
  }, [mode, setAstro]);

  useEffect(() => {
  try {
    const audio = new Audio("/audio/eclipse-intro-voiceover.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  } catch (e) {
    console.error(e);
  }
}, []);

  // Preload audio when this screen loads
  
  const playIntroAudio = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio play failed:", err);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle>What Is an Eclipse?</SectionTitle>

      {/* Intro Glass Card */}
      <GlassCard className="w-full max-w-md mt-3 mb-6 p-5">
        <p className="text-white/90 text-sm leading-7">
          An eclipse occurs when one heavenly body, such as a moon or planet,
          moves into the shadow of another heavenly body.
        </p>

        <p className="text-white/70 text-sm leading-7 mt-3">
          Let’s learn about the two types of eclipses on Earth: Solar Eclipse and
          Lunar Eclipse.
        </p>

        <button
          onClick={playIntroAudio}
          className={`mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-3 font-medium border transition-all ${
            isPlaying
              ? "bg-pink-500/20 border-pink-400 text-pink-300"
              : "bg-white/10 border-white/20 text-white"
          }`}
        >
          {isPlaying ? "⏸ Pause Audio" : "🔊 Read Aloud"}
        </button>
      </GlassCard>

      {/* Toggle Buttons */}
      <div className="w-full max-w-md mb-5 flex justify-center">
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex-1 flex justify-center">
            <IconChip
              active={mode === "solar"}
              onClick={() => setMode("solar")}
            >
              ☀️ Solar
            </IconChip>
          </div>

          <div className="flex-1 flex justify-center">
            <IconChip
              active={mode === "lunar"}
              onClick={() => setMode("lunar")}
            >
              🌕 Lunar
            </IconChip>
          </div>
        </div>
      </div>

      {/* Diagram */}
      <GlassCard className="w-full max-w-md p-4 mb-5">
        <img
          src={
            mode === "solar"
              ? "/images/solar-eclipse.svg"
              : "/images/lunar-eclipse.svg"
          }
          alt={mode === "solar" ? "Solar Eclipse" : "Lunar Eclipse"}
          className="w-full rounded-2xl"
        />
      </GlassCard>

      {/* Information Card */}
      <GlassCard className="w-full max-w-md p-5">
        {mode === "solar" ? (
          <>
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              ☀️ Solar Eclipse
            </h3>

            <p className="text-white/90 text-sm leading-6">
              A solar eclipse happens when the{" "}
              <span className="font-semibold text-gray-200">Moon</span> comes
              between the{" "}
              <span className="font-semibold text-yellow-300">Sun</span> and the{" "}
              <span className="font-semibold text-blue-400">Earth</span>.
            </p>

            <p className="text-white/70 text-sm mt-3">
              The Moon blocks the Sun's light and creates a shadow on Earth.
            </p>

            <div className="mt-4 rounded-xl bg-yellow-400/15 border border-yellow-300/30 p-3">
              <p className="text-yellow-200 text-sm font-medium">
                🌑 Order: Sun → Moon → Earth
              </p>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-blue-300 mb-3">
              🌕 Lunar Eclipse
            </h3>

            <p className="text-white/90 text-sm leading-6">
              A lunar eclipse happens when the{" "}
              <span className="font-semibold text-blue-400">Earth</span> comes
              between the{" "}
              <span className="font-semibold text-yellow-300">Sun</span> and the{" "}
              <span className="font-semibold text-gray-200">Moon</span>.
            </p>

            <p className="text-white/70 text-sm mt-3">
              Earth's shadow falls on the Moon, making it appear darker or reddish.
            </p>

            <div className="mt-4 rounded-xl bg-blue-400/15 border border-blue-300/30 p-3">
              <p className="text-blue-200 text-sm font-medium">
                🌍 Order: Sun → Earth → Moon
              </p>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}