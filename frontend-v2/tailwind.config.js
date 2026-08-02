/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#7C5CFF',
          secondary: '#A98BFF',
          accent: '#6B4EFF',
          light: '#F4F1FF',
          sidebar: '#F9F8FC'
        },
        background: '#FAFAFC',
        card: '#FFFFFF',
        text: {
          main: '#1A1A1A',
          muted: '#777777'
        },
        status: {
          success: '#4CAF50',
          warning: '#FF9800',
          danger: '#F44336',
          info: '#3F8CFF'
        },
        border: 'rgba(0,0,0,0.05)',
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        'card': '24px',
        'input': '16px',
        'button': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.02)',
        'lift': '0 12px 30px rgba(124, 92, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
      },
      fontSize: {
        'h1': ['56px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['42px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['30px', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title': ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(.22,.61,.36,1)',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
}
