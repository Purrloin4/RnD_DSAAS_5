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
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light:{
        colors:{
          primary: {
            DEFAULT: "#9333ea",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#facc15",
            foreground: "#000000",
          }
        }
      },
      dark:{

      }
    }
  })],
};
export default config;
