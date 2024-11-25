import type { Config } from "tailwindcss";

export default {
  content: [
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        icon: {
          primary: "hsl(var(--color-icon-primary))",
          secondary: "hsl(var(--color-icon-secondary))",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
