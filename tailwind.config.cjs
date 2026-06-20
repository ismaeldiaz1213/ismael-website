module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
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
