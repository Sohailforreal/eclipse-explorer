import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

export function Sun(props) {
  const sun = useRef();
  const sunMap = useLoader(TextureLoader, "/textures/sun.jpg");

  useFrame((_, delta) => {
    sun.current.rotation.y += delta * 0.08;
  });

  return (
    <group {...props}>
      <pointLight intensity={6} color="#FFD36B" distance={20} />

      <mesh ref={sun}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={sunMap}
          emissive="#ffb000"
          emissiveMap={sunMap}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Glow Halo */}
      <mesh scale={1.22}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#ff9900"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={1.35}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#ffcc55"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}


export function Earth({ position = [0, 0, 0], scale = 1, spin = true, receiveShadow = false, ...props }) {
  const earth = useRef();
  const clouds = useRef();

  const [dayMap, normalMap, cloudMap] = useLoader(TextureLoader, [
    "/textures/earth_day.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_clouds.jpg",
  ]);

  useFrame((_, delta) => {
    earth.current.rotation.y += delta * 0.15;
    clouds.current.rotation.y += delta * 0.18;
  });

  return (
    <group position={position} scale={scale} {...props}>
      <mesh ref={earth} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[0.7, 128, 128]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={clouds} scale={1.01} receiveShadow={receiveShadow}>
        <sphereGeometry args={[0.7, 128, 128]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.05}>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export function Moon(props) {
  const moon = useRef();

  const [moonMap, moonBump] = useLoader(TextureLoader, [
    "/textures/moon.jpg",
    "/textures/moon_bump.jpg",
  ]);

  useFrame((_, delta) => {
    moon.current.rotation.y += delta * 0.06;
  });

  return (
    <mesh ref={moon} {...props}>
      <sphereGeometry args={[0.48, 128, 128]} />
      <meshStandardMaterial
        map={moonMap}
        bumpMap={moonBump}
        bumpScale={0.05}
        roughness={1}
      />
    </mesh>
  );
}

export function TwinkleStars() {
  const stars = useLoader(TextureLoader, "/textures/3.jpg");

  return (
    <mesh scale={50}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial map={stars} side={THREE.BackSide} />
    </mesh>
  );
}


function lerpHexColor(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}




export function EclipseMoon({ aligned = 0, ...props }) {
  const moonMap = useLoader(TextureLoader, "/textures/moon.jpg");

  const a = Math.min(1, Math.max(0, aligned));

  const tint = lerpHexColor("#E8E8EC", "#0A0A0D", a);
  const backingTint = lerpHexColor("#CFE3F5", "#050507", a); // sky-tinted → black
  const opacity = THREE.MathUtils.lerp(0.14, 1, a);

  return (
    <group {...props}>
      {/* Solid backing — always opaque, sits just behind the moon mesh */}
      <mesh position={[0, 0, -0.01]} scale={0.97}>
        <sphereGeometry args={[0.48, 64, 64]} />
        <meshBasicMaterial color={backingTint} toneMapped={false} />
      </mesh>

      
      {/* Textured moon — this is the layer that fades in/out */}
      <mesh>
        <sphereGeometry args={[0.48, 18, 28]} />
        <meshBasicMaterial
          map={moonMap}
          color={tint}
          transparent
          opacity={opacity}
          depthWrite={a > 0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ---------- EclipseSun: textured, smoother/yellower halo ----------

export function EclipseSun(props) {
  const sunMap = useLoader(TextureLoader, "/textures/sun.jpg");

  return (
    <group {...props}>
      {/* Solid warm base — always fully opaque */}
      <mesh>
        <sphereGeometry args={[0.55, 128, 128]} />
        <meshBasicMaterial color="#ffeab9" toneMapped={false} />
      </mesh>

      {/* Faint texture layer on top — subtle hint of surface detail only */}
      <mesh scale={1.001}>
        <sphereGeometry args={[0.55, 128, 128]} />
        <meshBasicMaterial
          map={sunMap}
          color="#e9b32f"
          transparent
          opacity={0.25}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Smoother, more gradual halo — softer falloff, warmer tones */}
      <mesh scale={1.12}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshBasicMaterial
          color="#FFE9A8"
          transparent
          opacity={0.28}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.28}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshBasicMaterial
          color="#FFDD8A"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.5}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshBasicMaterial
          color="#FFD98A"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.8}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial
          color="#ffbc3e"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight intensity={10} color="#FFE9A8" distance={20} />
    </group>
  );
}