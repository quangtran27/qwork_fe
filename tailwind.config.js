/** @type {import('tailwindcss').Config} */
const PRIMARY_COLOR = '#1d4ed8'
const SECONDARY_COLOR = '#db2777'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        background: '7 / 1',
      },
      backgroundImage: {
        company: 'url("/images/background_company.jpg")',
        login: 'url("/images/login-background.jpg")',
        search: 'url("/images/search-background.jpg")',
      },
      colors: {
        primary: PRIMARY_COLOR,
        secondary: SECONDARY_COLOR,
      },
      height: {
        header: '72px',
      },
      margin: {
        header: '72px',
      },
      padding: {
        header: '72px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: PRIMARY_COLOR,
          secondary: SECONDARY_COLOR,
          'base-100': '#ffffff',
          accent: '#1dcdbc',
          neutral: '#2b3440',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#dc2626',
        },
      },
    ],
  },
}
