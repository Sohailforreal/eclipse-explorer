import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PinholeViewerModel({ step = 0 }) {
  const group = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  // Lid opens gradually during the first step
  const flapAngle = THREE.MathUtils.lerp(
    -Math.PI / 2.8,
    0,
    Math.min(step / 1, 1)
  );

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* Main black box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.7, 1.1]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      {/* Open top flap */}
      <mesh position={[0, 0.38, -0.4]} rotation={[flapAngle, 0, 0]}>
        <boxGeometry args={[1.6, 0.03, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Step 2 – White paper inside */}
      {step >= 1 && (
        <mesh position={[-0.74, 0, 0]}>
          <planeGeometry args={[0.55, 0.42]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Step 3 – Aluminum foil */}
      {step >= 2 && (
        <>
          <mesh position={[0.82, 0, 0]}>
            <planeGeometry args={[0.42, 0.42]} />
            <meshStandardMaterial
              color="#d9d9d9"
              metalness={0.9}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Tiny pinhole */}
          <mesh position={[0.83, 0, 0.01]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </>
      )}

      {/* Step 4 – Green viewing port */}
      {step >= 3 && (
        <mesh position={[0.45, -0.08, 0.56]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshBasicMaterial color="#8BFF3D" />
        </mesh>
      )}

      {/* Step 5 – Sunlight projection */}
      {step >= 4 && (
        <>
          {/* Light beam */}
          <mesh
            position={[0.15, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.015, 0.04, 0.75, 16]} />
            <meshBasicMaterial color="#FFD54A" transparent opacity={0.45} />
          </mesh>

          {/* Sun image on paper */}
          <mesh position={[-0.62, 0, 0.02]}>
            <circleGeometry args={[0.06, 32]} />
            <meshBasicMaterial color="#FFD54A" />
          </mesh>

          {/* Moon shadow */}
          <mesh position={[-0.59, 0.01, 0.03]}>
            <circleGeometry args={[0.045, 32]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </>
      )}
    </group>
  );
}