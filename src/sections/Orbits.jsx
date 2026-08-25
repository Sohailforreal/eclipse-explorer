import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Sun, Earth, Moon, TwinkleStars } from "../three/bodies";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, IconChip, BigButton } from "../components/ui";
import { CanvasSkeleton } from "../components/CanvasSkeleton";

const MERCURY_R = 1.4;
const VENUS_R = 2.0;
const EARTH_R = 3;
const MOON_R = 0.55;

function OrbitRing({ radius, color, opacity }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const a = (i / 100) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

function Scene({ playing, speed }) {
  const mercury = useRef();
  const venus = useRef();
  const earth = useRef();
  const moon = useRef();

  const mercuryAngle = useRef(0);
  const venusAngle = useRef(1.2);
  const earthAngle = useRef(2.4);
  const moonAngle = useRef(0);

  useFrame((_, dt) => {
    if (playing) {
      mercuryAngle.current += dt * 0.9 * speed;
      venusAngle.current += dt * 0.55 * speed;
      earthAngle.current += dt * 0.35 * speed;
      moonAngle.current += dt * 1.5 * speed;
    }

    mercury.current.position.set(
      Math.cos(mercuryAngle.current) * MERCURY_R,
      0,
      Math.sin(mercuryAngle.current) * MERCURY_R
    );

    venus.current.position.set(
      Math.cos(venusAngle.current) * VENUS_R,
      0,
      Math.sin(venusAngle.current) * VENUS_R
    );

    earth.current.position.set(
      Math.cos(earthAngle.current) * EARTH_R,
      0,
      Math.sin(earthAngle.current) * EARTH_R
    );

    moon.current.position.set(
      earth.current.position.x + Math.cos(moonAngle.current) * MOON_R,
      0,
      earth.current.position.z + Math.sin(moonAngle.current) * MOON_R
    );
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#FFD166" />

      <TwinkleStars />

      <OrbitRing radius={MERCURY_R} color="#BDBDBD" opacity={0.2} />
      <OrbitRing radius={VENUS_R} color="#D8A46B" opacity={0.2} />
      <OrbitRing radius={EARTH_R} color="#4FC3F7" opacity={0.25} />

      <Sun scale={0.9} />

      <mesh ref={mercury}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#8E8E8E" />
      </mesh>

      <mesh ref={venus}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#D8A46B" />
      </mesh>

      <group ref={earth}>
        <Earth scale={0.5} />
      </group>

      <group ref={moon}>
        <Moon scale={0.2} />
      </group>
    </>
  );
}

export default function Orbits() {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const { setAstro } = useAstro();

  useEffect(() => {
    setAstro({
      mood: "thinking",
      message:
        "Mercury, Venus and Earth all orbit the Sun at different speeds!",
    });
  }, [setAstro]);

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub="An orbit is a path. It’s the way something goes around an object in space. The moon goes in orbit around Earth.">
        Orbits in Motion
      </SectionTitle>

      {/* Bigger Canvas */}
      <div
        className="relative w-full max-w-md h-[380px] rounded-3xl overflow-hidden bg-black/15"
        style={{ contain: "layout size" }}
      >
        <Canvas
          camera={{ position: [0, 8, 0.01], fov: 72 }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <Suspense fallback={null}>
            <Scene playing={playing} speed={speed} />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableRotate={true}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={8}
            zoomSpeed={0.8}
            rotateSpeed={0.6}
          />
        </Canvas>

        <CanvasSkeleton />
      </div>

      <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
        <BigButton
          color={playing ? "mint" : "sunny"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "⏸ Pause" : "▶️ Play"}
        </BigButton>

        <IconChip active={speed === 0.4} onClick={() => setSpeed(0.4)}>
          🐢 Slow
        </IconChip>

        <IconChip active={speed === 1.6} onClick={() => setSpeed(1.6)}>
          🐇 Fast
        </IconChip>
      </div>
    </div>
  );
}
