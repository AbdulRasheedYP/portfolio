/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#060913',
          card: 'rgba(12, 18, 36, 0.85)',
          surface: '#0f172a',
          lighter: '#162038',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        primary: {
          DEFAULT: '#00d9ff',
          hover: '#00b8d9',
          glow: 'rgba(0, 217, 255, 0.25)'
        },
        accent: {
          DEFAULT: '#7928ca',
          pink: '#ff0080',
          glow: 'rgba(121, 40, 202, 0.25)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
    container: false,
  },
}
