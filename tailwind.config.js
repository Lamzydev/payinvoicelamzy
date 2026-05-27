/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // ← enables dark: prefix
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'",    'sans-serif'],
        body:    ["'Figtree'", 'sans-serif'],
      },
      colors: {
        amber:   { DEFAULT: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
        emerald: { DEFAULT: '#10b981', light: '#d1fae5', dark: '#059669' },
        coral:   { DEFAULT: '#f43f5e', light: '#ffe4e6', dark: '#e11d48' },
      },
      boxShadow: {
        card:       '0 1px 3px rgba(15,14,23,0.06), 0 4px 16px rgba(15,14,23,0.04)',
        'card-hover':'0 4px 12px rgba(15,14,23,0.1), 0 16px 40px rgba(15,14,23,0.08)',
        float:      '0 20px 60px rgba(15,14,23,0.15)',
      },
    },
  },
  plugins: [],
};