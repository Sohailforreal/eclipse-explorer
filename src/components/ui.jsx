import { motion } from "framer-motion";

const BUTTON_THEME = {
  sunny: { top: "#FFD166", bottom: "#C98A2E", text: "text-space-900" },
  coral: { top: "#FF6F91", bottom: "#B5324B", text: "text-white" },
  mint: { top: "#06D6A0", bottom: "#04936D", text: "text-space-900" },
};


export function BigButton({ children, onClick, color = "sunny", className = "", disabled, ariaLabel }) {
  const theme = BUTTON_THEME[color] || BUTTON_THEME.sunny;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`relative inline-block select-none bg-transparent ${disabled ? "opacity-40" : ""} ${className}`}
    >
      <span
        className="absolute inset-x-0 top-1.5 bottom-0 rounded-full"
        style={{ background: theme.bottom }}
        aria-hidden="true"
      />
      <motion.span
        whileTap={disabled ? {} : { y: 5 }}
        transition={{ duration: 0.08 }}
        className={`relative flex items-center justify-center gap-2 font-display font-bold text-lg sm:text-xl px-7 py-3.5 min-h-[44px] rounded-full ${theme.text}`}
        style={{ background: theme.top }}
      >
        {children}
      </motion.span>
    </button>
  );
}


export function IconChip({ children, active, onClick, className = "" }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-2xl font-display font-bold text-sm sm:text-base transition-all border-2 ${
        active
          ? "bg-mint border-mint text-space-900 shadow-[0_4px_0_rgba(0,0,0,0.25)]"
          : "bg-white/10 border-white/25 text-white hover:bg-white/20"
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function SectionTitle({ children, sub }) {
  return (
    <div className="text-center mb-4 sm:mb-6 px-4">
      <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]">
        {children}
      </h2>
      {sub && <p className="font-body text-white/75 text-sm sm:text-base mt-1">{sub}</p>}
    </div>
  );
}

export function GlassCard({ children, className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}
