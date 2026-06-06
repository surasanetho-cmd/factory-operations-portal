import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        foreground: "var(--color-text)",
        muted: "var(--color-text-muted)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Tahoma", "sans-serif"],
        display: ["var(--font-display)", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
