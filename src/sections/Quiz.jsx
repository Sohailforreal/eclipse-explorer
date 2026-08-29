import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useAstro } from "../context/AstroContext";
import { SectionTitle, GlassCard } from "../components/ui";

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
    type: "mc-image",
    q: "What keeps your eyes safe when looking at a solar eclipse?",
    options: [
      { key: "glasses", image: "/images/eclipse-glasses.png" },
      { key: "sunglasses", image: "/images/sunglasses.png" },
      { key: "bare", image: "/images/eyes.png" },
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
    type: "mc",
    q: "Which eclipse is SAFE to watch without special glasses?",
    options: [
      { key: "solar", label: "☀️ Solar Eclipse" },
      { key: "lunar", label: "🌕 Lunar Eclipse" },
      { key: "both", label: "🌍 Both" },
    ],
    answer: "lunar",
  },
];

function fireConfetti() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function McQuestion({ question, onAnswer }) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {question.options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onAnswer(opt.key === question.answer)}
          className="w-20 h-20 rounded-2xl bg-white/90 text-3xl flex items-center justify-center"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function McImageQuestion({ question, onAnswer }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {question.options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onAnswer(opt.key === question.answer)}
          className="p-2 rounded-2xl bg-white/90"
        >
          <img
            src={opt.image}
            alt={opt.key}
            className="w-20 h-20 object-contain mx-auto"
          />
        </button>
      ))}
    </div>
  );
}

function TfQuestion({ question, onAnswer }) {
  return (
    <div className="flex gap-6 justify-center">
      <button
        onClick={() => onAnswer(question.answer === true)}
        className="w-24 h-24 rounded-full bg-green-400 text-4xl"
      >
        👍
      </button>

      <button
        onClick={() => onAnswer(question.answer === false)}
        className="w-24 h-24 rounded-full bg-red-400 text-4xl"
      >
        👎
      </button>
    </div>
  );
}

function MatchQuestion({ question, onAnswer }) {
  const [matched, setMatched] = useState({});
  const zoneRefs = useRef({});

  const handleDrop = (pairId, point) => {
    for (const p of question.pairs) {
      const el = zoneRefs.current[p.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();

      if (
        point.x >= r.left &&
        point.x <= r.right &&
        point.y >= r.top &&
        point.y <= r.bottom
      ) {
        if (p.id === pairId) {
          const next = { ...matched, [pairId]: true };
          setMatched(next);

          if (Object.keys(next).length === question.pairs.length) {
            onAnswer(true);
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-4">
        {question.pairs.map((p) => (
          <div
            key={p.id}
            ref={(el) => (zoneRefs.current[p.id] = el)}
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl"
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
              dragSnapToOrigin
              dragMomentum={false}
              onDragEnd={(e, info) => handleDrop(p.id, info.point)}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold"
            >
              {p.label}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function Badge() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-44 h-44 rounded-full bg-yellow-400 flex flex-col items-center justify-center"
    >
      <span className="text-5xl">🏅</span>
      <span className="font-bold text-black text-center">
        Eclipse Explorer
      </span>
    </motion.div>
  );
}

export default function Quiz() {
  const { setAstro } = useAstro();

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);

  const finished = index >= QUESTIONS.length;

  const handleAnswer = (correct) => {
    if (correct) {
      fireConfetti();
      setScore((s) => s + 1);
      setMessage("Correct!");

      setTimeout(() => {
        setMessage(null);
        setIndex((i) => i + 1);
      }, 900);
    } else {
      setMessage("Try again!");

      setTimeout(() => setMessage(null), 900);
    }
  };

  useEffect(() => {
    if (finished) {
      setAstro({
        mood: "cheer",
        message: "Mission complete! You're an Eclipse Explorer!",
      });
    } else if (message === "Correct!") {
      setAstro({ mood: "cheer", message: "Great job!" });
    } else if (message === "Try again!") {
      setAstro({ mood: "oops", message: "Try again!" });
    } else {
      setAstro({ mood: "thinking", message: "Take your time!" });
    }
  }, [finished, message, setAstro]);

  if (finished) {
    return (
      <div className="h-full flex flex-col items-center justify-center pt-20 pb-48 px-4">
        <SectionTitle>Mission Complete!</SectionTitle>

        <Badge />

        <p className="text-white mt-5 text-center">
          You scored **{score}/{QUESTIONS.length}**.
        </p>
      </div>
    );
  }

  const q = QUESTIONS[index];

  return (
    <div className="h-full flex flex-col items-center pt-20 pb-48 px-4 overflow-y-auto">
      <SectionTitle sub={`Question ${index + 1} of ${QUESTIONS.length}`}>
        Quiz Time!
      </SectionTitle>

      <GlassCard className="w-full max-w-sm p-6 flex flex-col items-center gap-5">
        <p className="text-white text-center font-bold">{q.q}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {q.type === "mc" && (
              <McQuestion question={q} onAnswer={handleAnswer} />
            )}

            {q.type === "mc-image" && (
              <McImageQuestion question={q} onAnswer={handleAnswer} />
            )}

            {q.type === "tf" && (
              <TfQuestion question={q} onAnswer={handleAnswer} />
            )}

            {q.type === "match" && (
              <MatchQuestion question={q} onAnswer={handleAnswer} />
            )}
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}