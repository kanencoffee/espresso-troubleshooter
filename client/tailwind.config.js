/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF7F2',
        'cream-border': '#E8E0D5',
        'espresso-dark': '#1C1410',
        'espresso-muted': '#594D42',
        'amber-cafe': '#B45309',
        'amber-light': '#FEF3C7',
      },
    },
  },
  plugins: [],
};

