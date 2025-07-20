/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        forum: ['var(--font-Forum)'],
        avenir: ['var(--font-Avenir)'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        tertiary: 'var(--color-tertiary)',
      }
    },
  },
  plugins: [],
};
