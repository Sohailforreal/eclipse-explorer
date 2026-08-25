import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Earth, Moon, TwinkleStars } from "../three/bodies";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, IconChip, GlassCard } from "../components/ui";
import * as THREE from "three";

function CameraRig({ view }) {
  const target = useMemo(
    () =>
      view === "earth"
        ? { pos: [0, 0, 3.4], fov: 42 }
        : { pos: [0, 0.6, 7], fov: 45 },
    [view]
  );

  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(...target.pos), 0.06);
    state.camera.fov += (target.fov - state.camera.fov) * 0.06;
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
  });

  return null;
}

function OrbitRing({ radius, color, position=[0,0,0] }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const a = (i / 80) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  return (
    <line geometry={geometry} position={position}>
      <lineBasicMaterial color={color} transparent opacity={0.22} />
    </line>
  );
}

function Scene({ view, progress }) {
  const moonX = (progress - 0.5) * 1.5;
  const moonAngle = (progress - 0.5) * Math.PI * 0.8;

  const shadowAmount =
    1 - Math.min(1, Math.abs(progress - 0.5) / 0.25);

  return (
    <>
      <CameraRig view={view} />

      <ambientLight intensity={0.45} />
      <pointLight position={[-3, 0, 2]} intensity={3} color="#FFD166" />

      <TwinkleStars count={180} radius={14} />

      {view === "earth" ? (
        <>
          <Earth position={[0, 0, 0]} scale={0.5} />

          <Moon position={[moonX, 0, 0.35]} scale={0.75} spin={false} />

          {shadowAmount > 0.05 && (
            <mesh position={[moonX, 0, 0.36]}>
              <sphereGeometry args={[0.38, 64, 64]} />
              <meshBasicMaterial
                color={shadowAmount > 0.7 ? "#8B1E1E" : "#000000"}
                transparent
                opacity={shadowAmount * 0.55}
              />
            </mesh>
          )}
        </>
      ) : (
        <>
          <OrbitRing radius={2.2} position={[-2.2, 0, 0]} color="#60A5FA" />
          <Sun position={[-2, 0, 0]} scale={0.6} />

          <group position={[0, 0, 0]}>
            <Earth scale={0.45} />

            <OrbitRing radius={0.65} color="#BDBDBD" />

            <Moon
              position={[
                Math.cos(moonAngle) * 0.65,
                0,
                Math.sin(moonAngle) * 0.65,
              ]}
              rotation={[0, -moonAngle + Math.PI / 2, 0]}
              scale={0.24}
              spin={false}
            />
          </group>
        </>
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

  const [view, setView] = useState("earth");
  const [progress, setProgress] = useState(0.5);

  const aligned = 1 - Math.min(1, Math.abs(progress - 0.5) / 0.25);

  const eclipseType =
    aligned > 0.85 ? "total" : aligned > 0.35 ? "partial" : "none";

  useEffect(() => {
    setAstro({
      mood:
        eclipseType === "total"
          ? "excited"
          : eclipseType === "partial"
          ? "happy"
          : "thinking",
      message:
        eclipseType === "total"
          ? "🌕 Amazing! The Moon is completely inside Earth's shadow. This is a Blood Moon!"
          : eclipseType === "partial"
          ? "🌗 Earth's shadow is covering part of the Moon."
          : "Move the Moon into Earth's shadow to create a Lunar Eclipse!",
    });
  }, [eclipseType, setAstro]);

  return (
    <div className="relative h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <div className="relative z-10 w-full flex flex-col items-center">
        <SectionTitle sub="Move the Moon into Earth's shadow to create a Lunar Eclipse!">
          Lunar Eclipse Simulator
        </SectionTitle>

        {/* Canvas */}
        <GlassCard className="w-full max-w-lg p-3">
          <div className="relative w-full h-[340px] sm:h-[380px] rounded-3xl overflow-hidden bg-black/20">
            <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }}>
              <Scene view={view} progress={progress} />
            </Canvas>
          </div>
        </GlassCard>

        {/* Toggle Buttons */}
        <div className="flex gap-3 mt-5">
          <IconChip
            active={view === "earth"}
            onClick={() => setView("earth")}
          >
            🌍 Earth View
          </IconChip>

          <IconChip
            active={view === "space"}
            onClick={() => setView("space")}
          >
            🛰️ Space View
          </IconChip>
        </div>

        {/* Slider */}
        <div className="w-full max-w-lg mt-6 px-2">
          <EclipseSlider progress={progress} onChange={setProgress} />
        </div>

        {/* Status Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={eclipseType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg mt-5"
          >
            <GlassCard className="p-4 text-center">
              {eclipseType === "total" && (
                <>
                  <h3 className="text-red-400 text-xl font-bold">
                    🌕 Total Lunar Eclipse
                  </h3>
                  <p className="text-white/80 text-sm mt-2">
                    The Moon is completely inside Earth's shadow and turns into a beautiful Blood Moon.
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
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}