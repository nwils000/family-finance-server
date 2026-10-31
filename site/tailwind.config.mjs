import app from '../client/tailwind.config.js';

/**
 * The app's Tailwind theme, imported rather than copied: the same semantic
 * tokens (bg-surface, text-ink, bg-coin, shadow-chunky, rounded-blob ...) and
 * the same fonts. The token VALUES live once, in client/src/index.css, which the
 * site imports too (src/app/globals.css). Only the content globs differ.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  ...app,
  content: ['./src/**/*.{ts,tsx}', '../client/src/art/**/*.{ts,tsx}'],
  theme: {
    ...app.theme,
    extend: {
      ...app.theme.extend,
      // Marketing-only: a slow float for the hero stickers.
      keyframes: { float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } },
      animation: { float: 'float 5s ease-in-out infinite' },
    },
  },
};
