// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Updated to include src directory
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': ' faktor 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    plugin(function({ addBase, addComponents, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.4xl'), fontWeight: theme('fontWeight.bold'), marginBottom: theme('spacing.4') },
        'h2': { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.bold'), marginBottom: theme('spacing.3') },
        'h3': { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.semibold'), marginBottom: theme('spacing.2') },
        'h4': { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.medium'), marginBottom: theme('spacing.2') },
      });
      
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.md'),
        },
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms ease',
        },
        '.feature-list li': {
          position: 'relative',
          paddingLeft: theme('spacing.8'),
          marginBottom: theme('spacing.3'),
        },
        '.feature-list li::before': {
          content: '""',
          position: 'absolute',
          left: '0',
          top: theme('spacing.2'),
          width: theme('spacing.5'),
          height: theme('spacing.5'),
          backgroundColor: theme('colors.purple.100'),
          borderRadius: '9999px',
        },
        '.feature-list li::after': {
          content: '"✓"',
          position: 'absolute',
          left: theme('spacing.1.5'),
          top: theme('spacing.1'),
          color: theme('colors.purple.600'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.bold'),
        },
      });
    }),
  ],
};