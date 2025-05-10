/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#181c24', // main dark bg
          light: '#23283a',   // lighter dark for sidebar
        },
        accent: {
          DEFAULT: '#a259ff', // purple accent
        },
        sidebar: '#23283a',
        'sidebar-border': '#353b50',
        'header-bg': '#23283a',
        'card-bg': '#23283a',
        'muted': '#8b92b2',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(20, 20, 40, 0.18)',
      },
    },
  },
  plugins: [],
};
