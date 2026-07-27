/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lh: {
          page: 'var(--lh-page)',
          card: 'var(--lh-card)',
          muted: 'var(--lh-muted)',
          border: 'var(--lh-border)',
          text: 'var(--lh-text)',
          secondary: 'var(--lh-text-secondary)',
          faint: 'var(--lh-text-muted)',
          accent: 'var(--lh-accent)',
          'accent-soft': 'var(--lh-accent-soft)',
          'accent-text': 'var(--lh-accent-text)',
        },
      },
      boxShadow: {
        lh: 'var(--lh-shadow)',
      },
    },
  },
  plugins: [],
}
