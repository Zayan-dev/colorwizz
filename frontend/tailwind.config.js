/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: "#cbd5e1",
        darkGray: "#94a3b8",
        black: "#000000",
      },
      fontFamily: {
        heading: ['"Montserrat"', "sans-serif"],
        body: ['"NotoSans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

