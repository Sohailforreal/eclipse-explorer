import { motion } from "framer-motion";

export default function NavButton({ direction = "next", onClick, disabled, size = 56 }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "next" ? "Next section" : "Previous section"}
      className={`relative shrink-0 select-none bg-transparent ${disabled ? "opacity-30 pointer-events-none" : ""}`}
      style={{ width: size, height: size + 6 }}
    >
      <span
        className="absolute inset-x-0 top-1.5 bottom-0 rounded-full"
        style={{ background: "#C98A2E" }}
        aria-hidden="true"
      />
      <motion.span
        whileTap={{ y: 5 }}
        transition={{ duration: 0.08 }}
        className="relative flex items-center justify-center rounded-full text-space-900 font-display font-extrabold"
        style={{ background: "#FFD166", width: size, height: size, fontSize: size * 0.4 }}
      >
        {direction === "next" ? "→" : "←"}
      </motion.span>
    </button>
  );
}