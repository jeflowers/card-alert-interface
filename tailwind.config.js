/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'nyce-blue': {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5bbfc',
          400: '#8098f9',
          500: '#6371f1',
          600: '#4f4ce3',
          700: '#3b3bc4',
          800: '#1e3a8a', // Primary brand color
          900: '#162454',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      maxHeight: {
        'table': 'calc(100vh - 240px)',
      },
    },
  },
  plugins: [],
}