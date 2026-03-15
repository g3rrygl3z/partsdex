/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PartsDex brand colors — updated to PRD specs
        primary: {
          DEFAULT: '#1B4F8A', // PRD Primary Blue
          dark: '#143d6b',
          light: '#2567b5',
        },
        success: {
          DEFAULT: '#2E7D32', // PRD Success Green
        },
        bgGray: '#F5F5F5',    // PRD Background Gray
        textDark: '#1A1A2E',  // PRD Text Dark
        textMuted: '#555555', // PRD Text Muted
        
        // Industry vertical specific accents (tailored for dark/premium theme)
        plumbing:  { DEFAULT: '#3b82f6', light: '#93c5fd' }, 
        hvac:      { DEFAULT: '#10b981', light: '#6ee7b7' },  
        'boiler-heating': { DEFAULT: '#f59e0b', light: '#fbbf24' },
      },
      fontFamily: {
        // Modern typography per developer guidelines
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '375px', // iPhone SE — primary design target per PRD
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
