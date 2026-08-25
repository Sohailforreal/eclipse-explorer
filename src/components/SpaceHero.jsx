import { motion } from "framer-motion";

export default function SpaceHero() {
  return (
    <div className="relative w-full h-72 flex items-center justify-center overflow-hidden">

      {/* Sun */}
      <motion.svg
        animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        viewBox="0 0 200 200"
        className="absolute top-0 w-48 h-48"
      >
        <circle cx="100" cy="100" r="65" fill="#FFD54A" />
        <circle cx="75" cy="90" r="8" fill="#222" />
        <circle cx="125" cy="90" r="8" fill="#222" />
        <path d="M75 125 Q100 145 125 125" stroke="#222" strokeWidth="5" fill="none" strokeLinecap="round"/>
      </motion.svg>

      {/* Earth */}
      <motion.svg
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        viewBox="0 0 220 220"
        className="absolute top-20 w-52 h-52"
      >
        <circle cx="110" cy="110" r="80" fill="#3BA9FF" />
        <path d="M60 80 L95 60 L110 90 L75 110 Z" fill="#48C774" />
        <path d="M135 120 L170 95 L180 140 L150 160 Z" fill="#48C774" />
        <circle cx="85" cy="105" r="9" fill="#222"/>
        <circle cx="135" cy="105" r="9" fill="#222"/>
        <path d="M85 145 Q110 160 135 145" stroke="#222" strokeWidth="5" fill="none" strokeLinecap="round"/>
      </motion.svg>

      {/* Moon */}
      <motion.svg
        animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
        viewBox="0 0 180 180"
        className="absolute bottom-0 w-40 h-40"
      >
        <circle cx="90" cy="90" r="65" fill="#F3F4F6"/>
        <circle cx="60" cy="60" r="10" fill="#D1D5DB"/>
        <circle cx="120" cy="110" r="8" fill="#D1D5DB"/>
        <circle cx="70" cy="90" r="8" fill="#222"/>
        <circle cx="110" cy="90" r="8" fill="#222"/>
        <path d="M70 120 Q90 135 110 120" stroke="#222" strokeWidth="5" fill="none" strokeLinecap="round"/>
      </motion.svg>

    </div>
  );
}