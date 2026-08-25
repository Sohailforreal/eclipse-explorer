import { useMemo } from "react";

export default function Starfield({ density = 90 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: density }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.4 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        gold: Math.random() > 0.8,
      })),
    [density]
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-space-900 via-space-700 to-space-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: s.gold ? "#FFD166" : "#FFFDF7",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
