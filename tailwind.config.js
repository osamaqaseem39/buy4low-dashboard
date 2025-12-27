/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e5e9ff',
          200: '#d0d7ff',
          300: '#a9b5ff',
          400: '#7d8aff',
          500: '#5b65ff',
          600: '#4845ff',
          700: '#3a34e8',
          800: '#2f2bb8',
          900: '#2d2a92',
          950: '#1a1749',
        },
        secondary: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fececa',
          300: '#fdaba5',
          400: '#fa7a70',
          500: '#f55246',
          600: '#e23428',
          700: '#bf2720',
          800: '#9e241f',
          900: '#842521',
          950: '#480e0b',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(91, 101, 255, 0.3)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

