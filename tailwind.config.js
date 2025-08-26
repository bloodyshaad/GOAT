/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'subtle-float': 'subtleFloat 8s ease-in-out infinite',
        'elegant-shine': 'elegantShine 4s ease-in-out infinite',
        'slow-rotate': 'slowRotate 30s linear infinite',
        'professional-pulse': 'professionalPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        subtleFloat: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        elegantShine: {
          '0%': {
            transform: 'translateX(-100%) skewX(-12deg)',
          },
          '100%': {
            transform: 'translateX(200%) skewX(-12deg)',
          },
        },
        slowRotate: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        professionalPulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
      },
    },
  },
  plugins: [],
};