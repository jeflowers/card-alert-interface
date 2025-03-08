/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './frontend/**/*.{html,js}',
    './backend/views/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        'nyce-blue': '#0056b3',
        'nyce-green': '#28a745',
        'nyce-red': '#dc3545',
        'nyce-gray': '#6c757d'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}