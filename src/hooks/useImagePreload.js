import { useEffect, useState } from "react";

/**
 * Preloads a list of image sources and reports when all are ready.
 * Works for plain <img>/gif assets that aren't tracked by
 * @react-three/drei's useProgress (which only sees useLoader calls).
 */
export function useImagePreload(sources) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!sources || sources.length === 0) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    let count = 0;

    const markLoaded = () => {
      count += 1;
      if (!cancelled && count === sources.length) setLoaded(true);
    };

    sources.forEach((src) => {
      const img = new Image();
      img.src = src;

      if (img.complete) {
        markLoaded();
      } else {
        img.onload = markLoaded;
        img.onerror = markLoaded; // don't block forever on a bad asset
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sources]);

  return loaded;
}
