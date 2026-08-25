import { createContext, useContext, useState, useCallback } from "react";

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [slotNode, setSlotNodeState] = useState(null);
  const [scene, setSceneState] = useState(null);
  const [camera, setCameraState] = useState({ position: [0, 0, 4], fov: 45 });

  const setSlotNode = useCallback((node) => setSlotNodeState(node), []);
  const setScene = useCallback((node) => setSceneState(() => node), []);
  const setCamera = useCallback((props) => setCameraState(props), []);

  return (
    <SceneContext.Provider value={{ slotNode, setSlotNode, scene, setScene, camera, setCamera }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside SceneProvider");
  return ctx;
}

// Attach the returned ref to a section's empty <div> — this is the "slot"
// the shared canvas will portal itself into while that section is visible.
export function useSceneSlot() {
  const { setSlotNode } = useScene();
  return useCallback((node) => setSlotNode(node), [setSlotNode]);
}