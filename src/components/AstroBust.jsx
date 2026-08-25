import { motion } from "framer-motion";

const FACES = {
  happy: (
    <>
      <circle cx="68" cy="76" r="4.5" fill="#16213E" />
      <circle cx="92" cy="76" r="4.5" fill="#16213E" />
      <path d="M66 90 Q80 101 94 90" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  excited: (
    <>
      <path d="M60 70 L70 76 L60 80" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 70 L90 76 L100 80" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="80" cy="93" rx="10" ry="8" fill="#16213E" />
    </>
  ),
  thinking: (
    <>
      <circle cx="68" cy="76" r="4" fill="#16213E" />
      <path d="M86 72 Q96 72 96 77" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M68 93 Q80 88 92 93" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  cheer: (
    <>
      <path d="M60 78 Q68 70 76 78" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M84 78 Q92 70 100 78" stroke="#16213E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="92" rx="11" ry="9" fill="#16213E" />
    </>
  ),
  oops: (
    <>
      <circle cx="68" cy="76" r="5.5" fill="#16213E" />
      <circle cx="92" cy="76" r="5.5" fill="#16213E" />
      <circle cx="80" cy="93" r="4.5" fill="#16213E" />
    </>
  ),
};

export default function AstroBust({ mood = "happy", size = 92 }) {
  return (
    <motion.div
      animate={{ y: [0, -7, 1, -4, 0], rotate: [0, -2.5, 1.5, -1.5, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size * 1.19 }}
      className="relative shrink-0 drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]"
    >
      <svg viewBox="0 0 160 190" className="w-full h-full overflow-visible">
        <path
          d="M28 190 Q20 128 54 116 Q80 106 106 116 Q140 128 132 190 Z"
          fill="#FBFAF7"
          stroke="#C7CEDA"
          strokeWidth="3"
        />
        <circle cx="40" cy="130" r="9" fill="#E14434" />
        <circle cx="120" cy="130" r="9" fill="#E14434" />
        <circle cx="64" cy="153" r="6.5" fill="#E14434" />
        <circle cx="80" cy="155" r="7.5" fill="#16213E" />
        <circle cx="96" cy="153" r="6.5" fill="#F2A73B" />
        <rect x="73" y="167" width="14" height="10" rx="2.5" fill="#E14434" />

        <circle cx="80" cy="70" r="58" fill="#FFFFFF" stroke="#C7CEDA" strokeWidth="3" />
        <circle cx="80" cy="74" r="45" fill="#16213E" />
        <circle cx="80" cy="79" r="34" fill="#FF9F5B" />
        <motion.g key={mood} initial={{ scale: 0.8, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
          {FACES[mood] || FACES.happy}
        </motion.g>
        <path d="M45 48 Q58 35 78 33" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.18" fill="none" />
        <ellipse cx="52" cy="34" rx="12" ry="6" fill="#FFFFFF" opacity="0.55" />
      </svg>
    </motion.div>
  );
}