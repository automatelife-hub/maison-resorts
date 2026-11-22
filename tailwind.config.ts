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
        background: "#ffffff",
        foreground: "#1f2937",
        primary: {
          DEFAULT: "#111827",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#4b5563",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#374151",
          foreground: "#ffffff",
        },
        border: "#e5e7eb",
        // Luxury system compatibility overrides mapping to light theme
        luxury: "#1f2937", 
        emerald: "#374151",
        warm: "#ffffff",
        monocle: {
          bg: "#ffffff",
          surface: "#f9fafb",
          fg: "#111827",
          muted: "#6b7280",
          border: "#e5e7eb",
          accent: "#374151",
        }
      },
    },
  },
  plugins: [],
};

export default config;
