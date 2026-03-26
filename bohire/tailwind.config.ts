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
        background: "var(--background)",
        foreground: "var(--foreground)",
        'dark-bg': '#08090d',
        'green': '#27d558',
        'teal': '#14b8a6',
      },
      backgroundImage: {
        'glassmorphism': 'linear-gradient(135deg, rgba(39, 213, 88, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
};
export default config;
