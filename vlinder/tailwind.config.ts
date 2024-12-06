import { colors } from "@nextui-org/react";
import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background-)",
        foreground: "var(--foreground-)",
        primary: "var(--primary-)",
        //secondary: "var(--secondary-)",
        "button-primary": "#eab308", // yellow-500
        "button-primary-hover": "#facc15", // yellow-400
        "button-secondary": "#facc15", // yellow-400
        "button-secondary-hover": "#fde047", // yellow-300
        "button-text": "#000000", // Black text
        
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#eab308", // yellow-500
            hover: "#facc15", // yellow-400
          },
          secondary: {
            DEFAULT: "#facc15", // yellow-400
            hover: "#fde047", // yellow-300
          },
          text: {
            button: "#000000", // Black text for buttons
          },
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#eab308", // yellow-400
            hover: "#facc15", // yellow-300
          },
          secondary: {
            DEFAULT: "#facc15", // yellow-300
            hover: "#fde047", // yellow-200
          },
          text: {
            button: "#000000", // Black text for buttons even in dark mode
          },
        },
      },
    },
  })],
};
export default config;
