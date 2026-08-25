/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#1B1464",
          800: "#241A6E",
          700: "#2E1A6B",
        },
        sun: { start: "#FFB703", end: "#FF6B35" },
        moon: { light: "#E8E4F3", dark: "#C9C2E8" },
        earthc: { teal: "#4ECDC4", blue: "#3A86FF", green: "#6BCB77" },
        coral: "#FF6F91",
        sunny: "#FFD166",
        mint: "#06D6A0",
      },
      fontFamily: {
        display: ["Baloo 2", "cursive"],
        body: ["Quicksand", "sans-serif"],
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        wiggle: "wiggle 1.2s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.2, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
    },
  },
  plugins: [],
};
