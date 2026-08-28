import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// No textures, no image loads — just colored primitives.
// Cheap to render, nothing for useProgress/CanvasSkeleton to wait on.
export default function PinholeViewerModel({ step = 0 }) {
  const group = useRef();
  const flap = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  // Flap folds down more as the build steps progress
  const flapAngle = THREE.MathUtils.lerp(0, -Math.PI / 2.6, Math.min(step / 3, 1));

  return (
    <group ref={group}>
      {/* Main box/envelope body */}
      <mesh>
        <boxGeometry args={[1.6, 0.08, 1.1]} />
        <meshStandardMaterial color="#F4E9D8" roughness={0.9} />
      </mesh>

      {/* Viewing window cut-out — appears from step 1 */}
      {step >= 1 && (
        <mesh position={[-0.55, 0.05, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.4]} />
          <meshBasicMaterial color="#1A1330" />
        </mesh>
      )}

      {/* Folding flap at the far end, hinges shut over steps */}
      <group position={[0.65, 0, 0]}>
        <mesh ref={flap} position={[0.15, 0, 0]} rotation={[0, 0, flapAngle]}>
          <boxGeometry args={[0.5, 0.06, 1.1]} />
          <meshStandardMaterial color="#EADCC4" roughness={0.9} />
        </mesh>

        {/* Pinhole — appears from step 2 */}
        {step >= 2 && (
          <mesh position={[0.35, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.08, 20]} />
            <meshBasicMaterial color="#0A0A0D" />
          </mesh>
        )}
      </group>

      {/* Little sun glyph, shown at the final "look through it" step */}
      {step >= 3 && (
        <mesh position={[1.1, 0.3, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#FFD166" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
