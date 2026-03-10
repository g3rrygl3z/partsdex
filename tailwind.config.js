/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // PartsDex design system — per PRD Section 6.2
        primary: '#1B4F8A', // Navigation, headings, primary CTAs, category badges
        success: '#2E7D32', // Compatibility indicators, active states, status labels
        bgGray: '#F5F5F5', // Page background, card backgrounds, alternate rows
        textDark: '#1A1A2E', // Body text, part names, primary labels
        textMuted: '#555555', // Secondary text, metadata, timestamps

        // Industry vertical accent colors (for category badges)
        plumbing: {
          DEFAULT: '#1B4F8A',
          light: '#E8F0FB',
        },
        hvac: {
          DEFAULT: '#E65100',
          light: '#FFF3E0',
        },
        boiler: {
          DEFAULT: '#4A148C',
          light: '#F3E5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography scale
        'part-name': ['1rem', { lineHeight: '1.5', fontWeight: '700' }], // 16px bold — PartCard
        'part-desc': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }], // 14px — short description
        'section': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }], // 18px — section headers
        'page-title': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 24px — page titles
      },
      spacing: {
        'touch': '44px', // Minimum touch target per WCAG 2.1
      },
      borderRadius: {
        'badge': '9999px', // Pill shape for category badges
      },
    },
  },
  plugins: [],
}
