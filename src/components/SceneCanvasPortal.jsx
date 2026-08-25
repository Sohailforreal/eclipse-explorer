import { useRef } from "react";
import { createPortal } from "react-dom";
import { Canvas } from "@react-three/fiber";
import { useScene } from "../context/SceneContext";

// Mounted exactly ONCE for the entire app (in App.jsx). The <Canvas> element
// itself never unmounts, so its WebGL context is never destroyed — only the
// DOM node it portals into changes as sections come and go.
export default function SceneCanvasPortal() {
  const { slotNode, scene, camera } = useScene();

  // A detached, off-DOM fallback container so the Canvas element always has
  // *somewhere* to portal into, even during the brief gap between one
  // section's slot unmounting and the next section's slot mounting.
  const fallbackRef = useRef(null);
  if (!fallbackRef.current) fallbackRef.current = document.createElement("div");

  const target = slotNode || fallbackRef.current;

  return createPortal(
    <Canvas camera={camera} dpr={[1, 1.5]}>
      {scene}
    </Canvas>,
    target
  );
}