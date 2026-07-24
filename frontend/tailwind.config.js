/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          dark: "#12151c",
        },
        canvas: {
          DEFAULT: "#f7f8fa",
          dark: "#0b0e14",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#1e222b",
        },
        accent: {
          50: "#f2f0fe",
          100: "#e5e1fd",
          200: "#c9c1fb",
          300: "#aca2f8",
          400: "#8f83f4",
          500: "#7c6ff0",
          600: "#6355d6",
          700: "#4c41ac",
          800: "#372f80",
          900: "#241f57",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};
