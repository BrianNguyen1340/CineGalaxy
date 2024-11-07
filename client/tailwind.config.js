/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '1400px': '1400px',
        '1200px': '1200px',
        '1001px': '1001px',
        '1000px': '1000px',
        '700px': '700px',
        '600px': '600px',
        '501px': '501px',
        '500px': '500px',
        '420px': '420px',
        '401px': '401px',
        '400px': '400px',
        '321px': '321px',
        '320px': '320px',
      },
      boxShadow: {
        custom: '0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
