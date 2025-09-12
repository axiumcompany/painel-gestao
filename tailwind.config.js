/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
      },
      colors: {
        'bg-primary': '#000000',
        'surface-1': '#1a1a1a',
        'surface-2': '#262626',
        'surface-3': '#333333',
        'text-primary': '#FFFFFF',
        'text-secondary': '#CCCCCC',
        'text-tertiary': '#AAAAAA',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        'gradient-action': 'linear-gradient(135deg, #FFFFFF 0%, #E5E5E5 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(255, 255, 255, 0.05)',
        'premium': '0 10px 30px rgba(255, 255, 255, 0.2)',
      },
      scale: {
        '98': '0.98',
      },
    },
  },
  plugins: [],
};