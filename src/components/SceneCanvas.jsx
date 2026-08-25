import { Canvas } from "@react-three/fiber";
import { useScene } from "../context/SceneContext";

// Mounted exactly once for the whole app — this is the ONLY <Canvas> that
// ever exists. Sections swap what renders inside it via useScene().
export default function SceneCanvas({ className, cameraProps }) {
  const { scene } = useScene();

  return (
    <div className={className}>
      <Canvas camera={cameraProps} dpr={[1, 1.5]}>
        {scene}
      </Canvas>
    </div>
  );
}