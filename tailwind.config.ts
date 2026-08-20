import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          50: "#EAF0F8",
          100: "#CBDAEC",
          200: "#9CB8D9",
          300: "#6D96C6",
          400: "#3E74B3",
          500: "#1E5590",
          600: "#153F6E",
          700: "#0B2545",
          800: "#081B33",
          900: "#051221",
        },
        gold: {
          DEFAULT: "#C9A24B",
          50: "#FBF6EA",
          100: "#F4E7C8",
          200: "#EAD4A1",
          300: "#DFC17A",
          400: "#D5AE53",
          500: "#C9A24B",
          600: "#A8843B",
          700: "#7E632C",
          800: "#54421D",
          900: "#2A210E",
        },
        sky: {
          light: "#EAF2FB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(11, 37, 69, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
