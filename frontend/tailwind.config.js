/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", '"SF Mono"', "Menlo", "monospace"],
      },
      colors: {
        bg: "#f7f8f8",
        surface: {
          DEFAULT: "#ffffff",
          2: "#f1f2f3",
          3: "#e8eaec",
        },
        line: {
          DEFAULT: "#e3e5e8",
          strong: "#cdd0d4",
        },
        ink: {
          DEFAULT: "#18181b",
          muted: "#56575c",
          dim: "#8b8f96",
        },
        accent: {
          DEFAULT: "#059669",
          hover: "#10b981",
          soft: "rgba(5, 150, 105, 0.12)",
        },
      },
      borderRadius: {
        card: "0.5rem",
      },
    },
  },
  plugins: [],
};
