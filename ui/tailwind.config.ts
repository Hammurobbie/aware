import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        bg: "var(--bg)",
        "bg-secondary": "var(--bg-secondary)",
        success: "var(--success)",
        error: "var(--error)",
        dark: "var(--dark)",
        light: "var(--light)",
        grayscale: "var(--grayscale)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        harsh: "8px 8px 0 0 var(--dark)",
        "harsh-tight": "5px 5px 0 0 var(--dark)",
      },
      dropShadow: {
        harsh: "1px 1px 0 var(--dark)",
      },
      keyframes: {
        "bounce-right": {
          "0%, 100%": {
            transform: "translateX(-5%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(10%)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        glow: {
          "0%, 100%": {
            "box-shadow": "0 0 5px -5px var(--text)",
          },
          "50%": {
            "box-shadow": "0 0 5px 5px var(--text);",
          },
        },
      },
      animation: {
        "bounce-right": "bounce-right 2s linear infinite",
        glow: "glow 3s linear infinite",
        pulse: "pulse 5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
