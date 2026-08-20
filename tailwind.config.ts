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
        grey: {
          DEFAULT: "#6B7280",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        // Acento coral/rosa tomado de los detalles del logo (gafas de sol,
        // flor de hibisco): se usa con moderación, para etiquetas y detalles
        // festivos que rompan el navy/dorado de aerolinea.
        coral: {
          DEFAULT: "#E0447E",
          50: "#FDF0F5",
          100: "#FBDCE8",
          200: "#F5B3CD",
          300: "#EE8AB2",
          400: "#E75F97",
          500: "#E0447E",
          600: "#C22A62",
          700: "#951F4B",
          800: "#671535",
          900: "#3A0C1E",
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
