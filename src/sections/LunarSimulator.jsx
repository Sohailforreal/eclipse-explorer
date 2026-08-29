import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

import { Sun, Earth, Moon, TwinkleStars } from "../three/bodies";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard, IconChip } from "../components/ui";

const SUN_Z = -9;
const EARTH_Z = -4.5;
const MOON_Z = 0;
const MOON_X_RANGE = 0.9;
const MOON_VISUAL_RADIUS = 0.125;
const ORBIT_RADIUS = 1;

function CameraRig() {
  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(0, 0, 3), 0.06);
    state.camera.fov += (40 - state.camera.fov) * 0.06;
    state.camera.lookAt(0, 0, -6);
    state.camera.updateProjectionMatrix();
  });

  return null;
}

function Scene({ progress, viewMode }) {
  const moonX = (progress - 0.5) * 2 * MOON_X_RANGE;

  // Side View orbit: starts at +100° and ends at +80° (340° sweep)
  const startAngle = THREE.MathUtils.degToRad(-360);
  const sweepAngle = THREE.MathUtils.degToRad(360);
  const angle = startAngle + progress * sweepAngle;

const moonPosition =
  viewMode === "front"
    ? [moonX, 0, MOON_Z]
    : [
        Math.cos(angle) * ORBIT_RADIUS, // left ↔ right
        0,                              // keep same height
        EARTH_Z + Math.sin(angle) * ORBIT_RADIUS, // front/back
      ];

  
  const shadowAmount =
  viewMode === "front"
    ? 1 - Math.min(1, Math.abs(progress - 0.5) / 0.15) // Front View (unchanged)
    : progress === 0 || progress === 1
    ? 1 // Total eclipse at 0 and 1
    : (progress > 0 && progress <= 0.2) ||
      (progress >= 0.8 && progress < 1)
    ? 0.5 // Partial eclipse
    : 0; // No eclipse
  return (
    <>
      <CameraRig />

      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, SUN_Z]} intensity={5} color="#FFD166" />
      <directionalLight position={[2, 1, 3]} intensity={1.2} color="#BFDFFF" />

      <TwinkleStars count={180} radius={20} />

      {viewMode === "front" ? (
        <>
          <Sun position={[0, 0, SUN_Z]} scale={1.1} />
          <Earth position={[0, 0, EARTH_Z]} scale={0.5} />
        </>
      ) : (
        <>
          {/* Side View: Sun left, Earth center */}
          <Sun position={[-2.8, 0, EARTH_Z]} scale={0.95} />
          <Earth position={[0, 0, EARTH_Z]} scale={0.5} />
        </>
      )}

      {viewMode === "side" && (
  <mesh position={[0, 0, EARTH_Z]} rotation={[Math.PI / 2, 0, 0]}>
    <ringGeometry args={[ORBIT_RADIUS - 0.015, ORBIT_RADIUS + 0.015, 128]} />
    <meshBasicMaterial
      color="#FFFFFF"
      transparent
      opacity={0.7}
      side={THREE.DoubleSide}
    />
  </mesh>
)}


      <Moon position={moonPosition} scale={0.22} spin={false} />

      {shadowAmount > 0.05 && (
        <mesh position={moonPosition}>
          <sphereGeometry args={[MOON_VISUAL_RADIUS, 64, 64]} />
          <meshBasicMaterial
            color={shadowAmount > 0.8 ? "#8B1E1E" : "#B3402E"}
            transparent
            opacity={shadowAmount * 0.8}
            blending={THREE.MultiplyBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

function EclipseSlider({ progress, onChange }) {
  const trackRef = useRef(null);

  const update = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    onChange(x / rect.width);
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => update(e.clientX)}
      onPointerMove={(e) => e.buttons === 1 && update(e.clientX)}
      className="relative w-full h-5 rounded-full bg-white/20 border border-white/25 touch-none cursor-pointer"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-slate-300"
        style={{ width: `${progress * 100}%` }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-lg flex items-center justify-center"
        style={{ left: `${progress * 100}%` }}
      >
        <div className="flex gap-[2px]">
          <div className="w-[2px] h-4 bg-slate-600 rounded-full" />
          <div className="w-[2px] h-4 bg-slate-600 rounded-full" />
          <div className="w-[2px] h-4 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
export default function LunarSimulator() {
  const { setAstro } = useAstro();

  // Toggle
  const [viewMode, setViewMode] = useState("front");

  // Separate slider positions
  const [frontProgress, setFrontProgress] = useState(0.5);
  const [sideProgress, setSideProgress] = useState(0);

  // Active slider value
  const progress = viewMode === "front" ? frontProgress : sideProgress;

  // Front View eclipse logic (unchanged)
  const frontEclipseType =
    frontProgress >= 0.47 && frontProgress <= 0.53
      ? "total"
      : frontProgress >= 0.38 && frontProgress <= 0.60
      ? "partial"
      : "none";

  // Side View eclipse logic
  const sideEclipseType =
  sideProgress === 0 || sideProgress === 1
    ? "total"
    : (sideProgress > 0 && sideProgress <= 0.2) ||
      (sideProgress >= 0.8 && sideProgress < 1)
    ? "partial"
    : "none";

  const eclipseType =
    viewMode === "front" ? frontEclipseType : sideEclipseType;

  useEffect(() => {
    setAstro({
      mood:
        eclipseType === "total"
          ? "excited"
          : eclipseType === "partial"
          ? "happy"
          : "thinking",
      message:
        viewMode === "front"
          ? "Move the Moon into Earth's shadow to create a Lunar Eclipse!"
          : "Move the Moon around Earth to see when a Lunar Eclipse happens!",
    });
  }, [viewMode, eclipseType, setAstro]);

  // Reset side-view slider whenever user opens Side View
  useEffect(() => {
    if (viewMode === "side") {
      setSideProgress(0);
    }
  }, [viewMode]);

  return (
    <div className="relative h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <div className="relative z-10 w-full flex flex-col items-center">
        <SectionTitle sub="Move the Moon to explore Lunar Eclipses!">
          Lunar Eclipse Simulator
        </SectionTitle>

        {/* 3D Scene */}
        <GlassCard className="w-full max-w-lg p-3">
          <div className="relative w-full h-[340px] sm:h-[380px] rounded-3xl overflow-hidden bg-black/20">
            <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
              <Scene progress={progress} viewMode={viewMode} />
            </Canvas>
          </div>
        </GlassCard>

        {/* Toggle Buttons */}
        <div className="w-full max-w-lg mt-5 mb-2 flex justify-center">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 flex justify-center">
              <IconChip
                active={viewMode === "front"}
                onClick={() => setViewMode("front")}
              >
                🌍 Front View
              </IconChip>
            </div>

            <div className="flex-1 flex justify-center">
              <IconChip
                active={viewMode === "side"}
                onClick={() => setViewMode("side")}
              >
                ↔️ Side View
              </IconChip>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="w-full max-w-lg mt-4 px-2">
          <EclipseSlider
            progress={progress}
            onChange={
              viewMode === "front"
                ? setFrontProgress
                : setSideProgress
            }
          />
        </div>

                {/* Information Glass Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${eclipseType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg mt-5"
          >
            <GlassCard className="p-4 text-center">

              {/* FRONT VIEW */}
              {viewMode === "front" && (
                <>
                  {eclipseType === "total" && (
                    <>
                      <h3 className="text-red-400 text-xl font-bold">
                        🌕 Total Lunar Eclipse
                      </h3>
                      <p className="text-white/80 text-sm mt-2">
                        The Moon is completely inside Earth's shadow and turns into
                        a beautiful Blood Moon.
                      </p>
                    </>
                  )}

                  {eclipseType === "partial" && (
                    <>
                      <h3 className="text-orange-300 text-xl font-bold">
                        🌗 Partial Lunar Eclipse
                      </h3>
                      <p className="text-white/80 text-sm mt-2">
                        Only part of the Moon passes through Earth's shadow.
                      </p>
                    </>
                  )}

                  {eclipseType === "none" && (
                    <>
                      <h3 className="text-white text-xl font-bold">
                        🌍 No Lunar Eclipse Yet
                      </h3>
                      <p className="text-white/70 text-sm mt-2">
                        Slide the Moon until it enters Earth's shadow.
                      </p>
                    </>
                  )}
                </>
              )}

              {/* SIDE VIEW */}
              {viewMode === "side" && (
                <>
                  {eclipseType === "total" && (
                    <>
                      <h3 className="text-red-400 text-xl font-bold">
                        🌕 Total Lunar Eclipse
                      </h3>
                      <p className="text-white/80 text-sm mt-2">
                        Sun → Earth → Moon are perfectly aligned. The Moon is
                        completely inside Earth's shadow and appears as a Blood Moon.
                      </p>
                    </>
                  )}

                  {eclipseType === "partial" && (
                    <>
                      <h3 className="text-orange-300 text-xl font-bold">
                        🌗 Partial Lunar Eclipse
                      </h3>
                      <p className="text-white/80 text-sm mt-2">
                        The Moon is entering or leaving Earth's shadow during its
                        revolution around Earth.
                      </p>
                    </>
                  )}

                  {eclipseType === "none" && (
                    <>
                      <h3 className="text-blue-300 text-xl font-bold">
                        🌍 No Lunar Eclipse
                      </h3>
                      <p className="text-white/70 text-sm mt-2">
                        The Moon is revolving around Earth, but it is outside
                        Earth's shadow.
                      </p>
                    </>
                  )}
                </>
              )}

            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}