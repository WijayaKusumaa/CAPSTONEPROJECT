/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#f7f6f3',
        ink: {
          DEFAULT: '#1f2328',
          soft: '#4b5360',
          mute: '#8a919c',
        },
        line: '#e8e5df',
        brand: {
          50: '#effaf7',
          100: '#d7f4ec',
          200: '#b2e8da',
          300: '#81d6c1',
          400: '#4fbca6',
          500: '#2f9f8a',
          600: '#238070',
          700: '#206759',
          800: '#1d5249',
          900: '#1b443d',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgb(31 35 40 / 0.04), 0 1px 1px rgb(31 35 40 / 0.03)',
        lift: '0 8px 24px -8px rgb(31 35 40 / 0.14), 0 2px 6px rgb(31 35 40 / 0.05)',
        toast: '0 16px 40px -12px rgb(31 35 40 / 0.25), 0 2px 8px rgb(31 35 40 / 0.06)',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'pop-in': 'pop-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
