/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: '#051612', // Deep Emerald Black
        emerald: '#062c21',
        accent: '#d4af37', // Royal Gold
        warm: '#fdfbf7',
      },
    },
  },
  plugins: [],
};
