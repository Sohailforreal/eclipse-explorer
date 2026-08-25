const LABELS = [
  "Blast Off", "Meet the Trio", "Orbits", "Shadow Play", "Solar Eclipse",
  "Lunar Eclipse", "How Often", "Safety First", "Your Story", "Quiz Time",
];

export default function ProgressBar({ current, total, onJump }) {
  return (
    <div className="fixed top-0 inset-x-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="max-w-3xl mx-auto flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onJump && i <= current + 0 && onJump(i)}
            aria-label={`Go to ${LABELS[i] || "section " + (i + 1)}`}
            className="group flex-1 h-1 sm:h-1 rounded-full overflow-hidden bg-white/15 relative"
            style={{ minWidth: 44 / total < 8 ? undefined : undefined }}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                i <= current
                  ? "bg-gradient-to-r from-pink-500 to-pink-300"
                  : "bg-transparent"
              }`}
              style={{ width: i <= current ? "100%" : "0%" }}
            />
          </button>
        ))}
      </div>
      
    </div>
  );
}
