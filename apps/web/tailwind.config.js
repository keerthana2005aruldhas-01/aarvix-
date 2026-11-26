/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F3F7EA',
          100: '#E4EDD0',
          200: '#CADDA6',
          300: '#A8C671',
          400: '#86AA3E',
          500: '#6C9C00',
          600: '#587F0A',
          700: '#496610',
          800: '#3C5410', // Primary brand green (from logo)
          900: '#2B3D12',
          950: '#1A2418', // Charcoal green (logo wordmark)
        },
        gold: {
          50: '#F4FAE6',
          100: '#E6F3C2',
          200: '#D3EA8F',
          300: '#BBDD58',
          400: '#A2CB2B',
          500: '#7FB01A', // Logo lime accent
          600: '#668F10',
          700: '#527109',
          800: '#425A0C',
          900: '#35470F',
        },
        warm: {
          50: '#FAFBF7', // Clean near-white (matches logo background)
          100: '#F3F6EE',
          200: '#E8EDDF',
          300: '#D8DFCB',
          400: '#BFC8AD',
          500: '#98A386',
          600: '#6F7A5E',
          700: '#4E573F',
          800: '#323A2A',
          900: '#1C2218',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(60, 84, 16, 0.05), 0 1px 2px -1px rgba(60, 84, 16, 0.05)',
        'card': '0 4px 6px -1px rgba(60, 84, 16, 0.07), 0 2px 4px -2px rgba(60, 84, 16, 0.05)',
        'elevated': '0 10px 25px -5px rgba(60, 84, 16, 0.12), 0 8px 10px -6px rgba(60, 84, 16, 0.08)',
        'gold-glow': '0 0 15px -3px rgba(127, 176, 26, 0.35)',
      },
    },
  },
  plugins: [],
}
