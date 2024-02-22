/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      default: ['Work Sans', 'sans-serif'],
      logs: ['Fira Code', 'monospace'],
    },
  },
  plugins: [],
};
