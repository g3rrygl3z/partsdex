/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PartsDex brand colors — professional trade-tool aesthetic
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        // Vertical accent colors
        plumbing:  { DEFAULT: '#3b82f6', light: '#dbeafe' },  // Blue
        hvac:      { DEFAULT: '#10b981', light: '#d1fae5' },  // Green
        boiler:    { DEFAULT: '#f59e0b', light: '#fef3c7' },  // Amber
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        'xs': '375px',  // iPhone SE — primary design target
      },
    },
  },
  plugins: [],
};
