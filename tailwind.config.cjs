module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // Keep in sync with the CSS variables in src/styles/colors.css
      colors: {
        night:    '#060d24', // page background
        navy:     '#0b1738', // card surface
        'navy-2': '#12214d', // raised surface
        duke:     '#00539b', // Duke blue
        'duke-royal': '#012169',
        sky:      '#7cc4ff',
        cream:    '#fff6e9',
        lime:     '#c8ff3d', // neon / primary action
        rosa:     '#ff4f9a', // rosa mexicano
        marigold: '#ffb020', // cempasúchil
        turquesa: '#2ee6d6', // talavera
        chile:    '#ff5a3c',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', 'Inter', 'sans-serif'],
        serif:   ['"Instrument Serif"', 'Georgia', 'serif'],
        mono:    ['"iA Writer Mono"', 'ui-monospace', 'monospace'],
      },
      opacity: {
        55: '0.55',
        85: '0.85',
        88: '0.88',
        92: '0.92',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
