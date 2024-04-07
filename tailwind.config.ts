import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors'
import { ScrollBar } from "./app/_utils/scrollbar";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      ...colors,
      "yellowish": "#eff6e0",
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#598392",
          secondary: "#aec3b0",
          accent: "#124559",
          "yellowish": "#eff6e0",
          neutral: "#FDF9F7",
          black: "#01161e",
        },
      },
      "dark",
      "cupcake",
    ],
  },
  plugins: [require("daisyui"), ScrollBar],
};
export default config;
