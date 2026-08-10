/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Cohere-inspired Palette
        primary: '#17171c',
        'cohere-black': '#000000',
        ink: '#212121',
        'deep-green': '#003c33',
        'dark-navy': '#071829',
        canvas: '#ffffff',
        'soft-stone': '#eeece7',
        'pale-green': '#edfce9',
        'pale-blue': '#f1f5ff',
        hairline: '#d9d9dd',
        'border-light': '#e5e7eb',
        'card-border': '#f2f2f2',
        'muted-slate': '#93939f',
        slate: '#75758a',
        'body-muted': '#616161',
        'action-blue': '#1863dc',
        coral: '#ff7759',
        'coral-soft': '#ffad9b',

        // Legacy / Brand Compatibility Aliases
        brand: {
          primary: '#17171c',
          secondary: '#003c33',
          accent: '#1863dc',
          light: '#eeece7',
          sidebar: '#ffffff'
        },
        background: '#ffffff',
        card: '#ffffff',
        text: {
          main: '#212121',
          muted: '#75758a'
        },
        status: {
          success: '#003c33',
          warning: '#ff7759',
          danger: '#b30000',
          info: '#1863dc'
        },
        border: '#e5e7eb',
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
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '22px',
        'xl': '30px',
        'pill': '32px',
        'card': '22px',
        'input': '8px',
        'button': '9999px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'lift': '0 4px 12px rgba(0, 0, 0, 0.06)',
      },
      fontSize: {
        'hero': ['72px', { lineHeight: '1.0', letterSpacing: '-0.03em', fontWeight: '400' }],
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'h2': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '400' }],
        'h3': ['24px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '400' }],
        'card-title': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-large': ['18px', { lineHeight: '1.4', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'mono': ['13px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '400' }],
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

