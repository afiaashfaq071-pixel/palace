/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        charcoal: "#1C1A19",
        gold: "#C6A46A",
        // Darker gold for small text on ivory (passes WCAG AA contrast).
        "gold-deep": "#7A5C25",
        ivory: "#F8F3EA",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
