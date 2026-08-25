import { createContext, useContext, useState, useCallback } from "react";

const AstroContext = createContext(null);

export function AstroProvider({ children }) {
  const [astro, setAstroState] = useState({ mood: "happy", message: "Hi! I'm Astro." });

  const setAstro = useCallback((next) => {
    setAstroState((prev) => ({ ...prev, ...next }));
  }, []);

  return <AstroContext.Provider value={{ astro, setAstro }}>{children}</AstroContext.Provider>;
}

export function useAstro() {
  const ctx = useContext(AstroContext);
  if (!ctx) throw new Error("useAstro must be used inside AstroProvider");
  return ctx;
}