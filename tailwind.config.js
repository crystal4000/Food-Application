/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-orange": "#f5c994",
        "custom-orange-hover": "#e2b885",
        "custom-orange-text": "#fbddbb",
        "color-bg": "#00302e",
        "footer-bg": "#0b0d17",
        "footer-header": "#f4f5f7",
        "footer-link": "#eeeff4",
        "copyright-color": "#d9dbe1",
        "border-color": "#333232",
        "white-74": "rgba(255, 255, 255, 0.74)",
        "white-87": "rgba(255, 255, 255, 0.87)",
        "white-83": "rgba(255, 255, 255, 0.83)",
        "white-95": "rgba(255, 255, 255, 0.95)",
      },
    },
  },
  plugins: [],
};
