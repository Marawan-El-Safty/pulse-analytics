import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
        },
        success: "#22c55e",
        danger: "#ef4444",
        warn: "#f59e0b",
        cyan: "#06b6d4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.9rem",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
    },
  },
  plugins: [],
};

export default config;
