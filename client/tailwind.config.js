/** Semantic tokens only. The values live in src/index.css; change a color there, once. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: { DEFAULT: token('surface'), soft: token('surface-soft'), sunk: token('surface-sunk') },
        line: { DEFAULT: token('line'), strong: token('ink') },
        ink: { DEFAULT: token('ink'), soft: token('ink-soft'), faint: token('ink-faint') },
        brand: { DEFAULT: token('brand'), deep: token('brand-deep'), light: token('brand-light') },
        coin: { DEFAULT: token('coin'), deep: token('coin-deep'), light: token('coin-light') },
        good: { DEFAULT: token('good'), deep: token('good-deep'), light: token('good-light') },
        bad: { DEFAULT: token('bad'), deep: token('bad-deep'), light: token('bad-light') },
        sky: token('sky'),
        grape: token('grape'),
        pink: token('pink'),
      },
      fontFamily: {
        display: ['Fredoka', 'Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      borderRadius: { blob: '28px' },
      boxShadow: {
        chunky: '0 4px 0 rgb(var(--ink))',
        'chunky-sm': '0 2px 0 rgb(var(--ink))',
        lift: '0 10px 30px -12px rgb(var(--ink) / 0.35)',
      },
    },
  },
  plugins: [],
};
