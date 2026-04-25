import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#e8eaf2",
          100: "#c5cade",
          200: "#9ea8c8",
          300: "#7786b2",
          400: "#586ba2",
          500: "#3a5092",
          600: "#2e4280",
          700: "#22326b",
          800: "#1a2340",
          900: "#111828",
        },
        orange: {
          50: "#fef3ea",
          100: "#fde0c5",
          200: "#fbcc9d",
          300: "#f9b875",
          400: "#f7a556",
          500: "#E8691A",
          600: "#d45e17",
          700: "#bc5213",
          800: "#a4470f",
          900: "#7e360a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
