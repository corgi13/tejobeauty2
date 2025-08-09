import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#F6E39D',
          300: '#EBD06C',
          400: '#E3C348',
          500: '#D4AF37',
          600: '#B9902A',
          700: '#936E1C',
          800: '#6E4E12',
          900: '#4A320A',
        },
        cream: '#F5EFE6',
        blush: '#F9DDE5',
        onyx: '#0B0B0B',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'border-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(212,175,55,0.0)' },
          '50%': { boxShadow: '0 0 24px rgba(212,175,55,0.35)' },
        },
      },
      animation: {
        border: 'border-move var(--mb-duration,6s) ease infinite',
        glow: 'glow-pulse 3s ease-in-out infinite',
      },
      backgroundImage: {
        'border-gradient': 'linear-gradient(90deg, rgba(212,175,55,0.6), rgba(255,255,255,0.5), rgba(249,221,229,0.6))',
      },
    },
  },
  plugins: [],
};

export default config;

