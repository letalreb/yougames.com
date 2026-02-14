import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Child-friendly color palette
        'kid-purple': '#9B59B6',
        'kid-blue': '#3498DB',
        'kid-green': '#2ECC71',
        'kid-yellow': '#F1C40F',
        'kid-orange': '#E67E22',
        'kid-red': '#E74C3C',
        'kid-pink': '#FF6B9D',
        'kid-sky': '#87CEEB',
      },
      fontFamily: {
        'kid': ['Comic Sans MS', 'Arial Rounded MT Bold', 'cursive'],
      },
      fontSize: {
        'kid-xl': '24px',
        'kid-2xl': '32px',
        'kid-3xl': '48px',
      },
      boxShadow: {
        'kid': '0 8px 0 rgba(0,0,0,0.2)',
        'kid-hover': '0 4px 0 rgba(0,0,0,0.2)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}

export default config
