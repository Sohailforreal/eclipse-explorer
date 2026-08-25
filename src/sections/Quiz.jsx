import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard, IconChip, BigButton } from "../components/ui";

const QUESTIONS = [
  {
    type: "mc",
    q: "Which one is the Sun?",
    options: [
      { key: "sun", label: "☀️" },
      { key: "earth", label: "🌍" },
      { key: "moon", label: "🌙" },
    ],
    answer: "sun",
  },
  {
    type: "tf",
    q: "The Moon makes its own light.",
    answer: false,
  },
  {
    type: "mc",
    q: "What keeps your eyes safe when looking at a solar eclipse?",
    options: [
      { key: "glasses", label: "🥽" },
      { key: "sunglasses", label: "🕶️" },
      { key: "bare", label: "👀" },
    ],
    answer: "glasses",
  },
  {
    type: "tf",
    q: "A total solar eclipse happens when the Moon fully covers the Sun.",
    answer: true,
  },
  {
    type: "mc",
    q: "What color can the Moon turn during a total lunar eclipse?",
    options: [
      { key: "red", label: "🔴 Red" },
      { key: "blue", label: "🔵 Blue" },
      { key: "green", label: "🟢 Green" },
    ],
    answer: "red",
  },
  {
    type: "match",
    q: "Match each eclipse to its picture!",
    pairs: [
      { id: "total-solar", label: "Total Solar", emoji: "⚫" },
      { id: "blood-moon", label: "Blood Moon", emoji: "🔴" },
    ],
  },
  {
    type: "tf",
    q: "Lunar eclipses are safe to watch with just your eyes.",
    answer: true,
  },
  {
    type: "mc",
    q: "About how many eclipses happen each year on Earth?",
    options: [
      { key: "0", label: "0" },
      { key: "4-7", label: "4 to 7" },
      { key: "100", label: "100" },
    ],
    answer: "4-7",
  },
  {
    type: "sim",
    q: "Drag the Moon to line it up and create a total solar eclipse!",
  },
];

function fireConfetti() {
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ["#FF6F91", "#FFD166", "#06D6A0"] });
}

function McQuestion({ question, onAnswer }) {
  const [wrong, setWrong] = useState(null);
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {question.options.map((opt) => (
        <motion.button
          key={opt.key}
          onClick={() => {
            if (opt.key === question.answer) onAnswer(true);
            else {
              setWrong(opt.key);
              onAnswer(false);
              setTimeout(() => setWrong(null), 500);
            }
          }}
          animate={wrong === opt.key ? { x: [0, -8, 8, -8, 0] } : {}}
          whileTap={{ scale: 0.92 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/90 text-3xl sm:text-4xl flex items-center justify-center shadow-lg"
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}

function TfQuestion({ question, onAnswer }) {
  const [wrong, setWrong] = useState(null);
  const handle = (val) => {
    if (val === question.answer) onAnswer(true);
    else {
      setWrong(val);
      onAnswer(false);
      setTimeout(() => setWrong(null), 500);
    }
  };
  return (
    <div className="flex gap-6 justify-center">
      <motion.button
        onClick={() => handle(true)}
        animate={wrong === true ? { x: [0, -8, 8, -8, 0] } : {}}
        whileTap={{ scale: 0.9 }}
        className="w-24 h-24 rounded-full bg-mint/90 text-4xl flex items-center justify-center shadow-lg"
        aria-label="True"
      >
        👍
      </motion.button>
      <motion.button
        onClick={() => handle(false)}
        animate={wrong === false ? { x: [0, -8, 8, -8, 0] } : {}}
        whileTap={{ scale: 0.9 }}
        className="w-24 h-24 rounded-full bg-coral/90 text-4xl flex items-center justify-center shadow-lg"
        aria-label="False"
      >
        👎
      </motion.button>
    </div>
  );
}

function MatchQuestion({ question, onAnswer }) {
  const [matched, setMatched] = useState({});
  const zoneRefs = useRef({});

  const done = Object.keys(matched).length === question.pairs.length;

  const handleDrop = (pairId, point) => {
    for (const p of question.pairs) {
      const el = zoneRefs.current[p.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom) {
        if (p.id === pairId) {
          const next = { ...matched, [pairId]: true };
          setMatched(next);
          if (Object.keys(next).length === question.pairs.length) onAnswer(true);
        }
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {question.pairs.map((p) => (
          <div
            key={p.id}
            ref={(el) => (zoneRefs.current[p.id] = el)}
            className={`w-20 h-20 rounded-2xl border-4 border-dashed flex items-center justify-center text-3xl ${
              matched[p.id] ? "border-mint bg-mint/20" : "border-white/30"
            }`}
          >
            {p.emoji}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {question.pairs
          .filter((p) => !matched[p.id])
          .map((p) => (
            <motion.div
              key={p.id}
              drag
              dragMomentum={false}
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDrop(p.id, info.point)}
              whileDrag={{ scale: 1.1, zIndex: 40 }}
              className="px-4 py-3 rounded-xl bg-white/90 font-body font-bold text-space-900 text-sm shadow-lg cursor-grab active:cursor-grabbing select-none"
            >
              {p.label}
            </motion.div>
          ))}
      </div>
      {done && <p className="text-mint font-body font-bold text-sm">Great matching! ✅</p>}
    </div>
  );
}

function SimQuestion({ onAnswer }) {
  const [offset, setOffset] = useState(-0.6);
  const trackRef = useRef(null);
  const TRACK_HALF = 90;
  const aligned = Math.abs(offset) < 0.1;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 80" className="w-56 h-24">
        <circle cx="30" cy="40" r="24" fill="#FFB703" />
        <circle cx="170" cy="40" r="18" fill="#4ECDC4" />
        <circle cx={100 + offset * 60} cy="40" r="12" fill="#C9C2E8" />
        {aligned && <circle cx="30" cy="40" r="30" fill="none" stroke="#FFD166" strokeWidth="3" opacity="0.8" />}
      </svg>
      <div ref={trackRef} className="relative w-56 h-12 flex items-center touch-none">
        <div className="absolute inset-x-0 h-2 rounded-full bg-white/15 top-1/2 -translate-y-1/2" />
        <motion.div
          drag="x"
          dragConstraints={{ left: -TRACK_HALF, right: TRACK_HALF }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(_, info) => {
            const track = trackRef.current;
            if (!track) return;
            const rect = track.getBoundingClientRect();
            const rel = info.point.x - (rect.left + rect.width / 2);
            const clamped = Math.max(-TRACK_HALF, Math.min(TRACK_HALF, rel));
            setOffset(clamped / TRACK_HALF);
          }}
          animate={{ x: offset * TRACK_HALF }}
          className="absolute top-1/2 -translate-y-1/2 -ml-5 w-10 h-10 rounded-full bg-moon-light shadow-lg flex items-center justify-center text-lg cursor-grab active:cursor-grabbing"
          style={{ left: "50%" }}
        >
          🌙
        </motion.div>
      </div>
      <BigButton color="mint" onClick={() => onAnswer(aligned)} disabled={!aligned}>
        {aligned ? "Lock it in! ✅" : "Line it up first"}
      </BigButton>
    </div>
  );
}

function Badge() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-sunny to-coral flex flex-col items-center justify-center shadow-2xl border-4 border-white/70"
    >
      <span className="text-5xl">🏅</span>
      <span className="font-display font-extrabold text-space-900 text-sm sm:text-base mt-1 text-center px-2">
        Eclipse
        <br />
        Explorer
      </span>
    </motion.div>
  );
}

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);
  const finished = index >= QUESTIONS.length;

  const handleAnswer = (correct) => {
    if (correct) {
      fireConfetti();
      setScore((s) => s + 1);
      setMessage({ mood: "cheer", text: "Yes! Great job! 🎉" });
      setTimeout(() => {
        setMessage(null);
        setIndex((i) => i + 1);
      }, 900);
    } else {
      setMessage({ mood: "oops", text: "Not quite — give it another try!" });
      setTimeout(() => setMessage(null), 900);
    }
  };


  const { setAstro } = useAstro();

useEffect(() => {
  if (finished) {
    setAstro({ mood: "cheer", message: "I'm so proud of you! See you at the next eclipse! 🚀" });
  } else if (message) {
    setAstro({ mood: message.mood, message: message.text });
  } else {
    setAstro({ mood: "thinking", message: "Take your time!" });
  }
}, [finished, message, setAstro]);

  if (finished) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center pt-20 pb-48 px-4">
        <SectionTitle>Mission Complete!</SectionTitle>
        <Badge />
        <p className="font-body text-white/85 mt-4 text-center">
          You scored {score} / {QUESTIONS.length} — you're officially an Eclipse Explorer!
        </p>
      </div>
    );
  }

  const q = QUESTIONS[index];

  return (
    <div className="h-full w-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub={`Question ${index + 1} of ${QUESTIONS.length}`}>Quiz Time!</SectionTitle>

      <GlassCard className="w-full max-w-sm p-6 flex flex-col items-center gap-5">
        <p className="text-center font-body font-bold text-white text-base sm:text-lg">{q.q}</p>
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {q.type === "mc" && <McQuestion question={q} onAnswer={handleAnswer} />}
            {q.type === "tf" && <TfQuestion question={q} onAnswer={handleAnswer} />}
            {q.type === "match" && <MatchQuestion question={q} onAnswer={handleAnswer} />}
            {q.type === "sim" && <SimQuestion onAnswer={handleAnswer} />}
          </motion.div>
        </AnimatePresence>
      </GlassCard>

    </div>
  );
}
