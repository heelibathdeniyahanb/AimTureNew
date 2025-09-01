/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'Inter'],
        nunito: ['Nunito', 'Poppins'],
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        pulseIce: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        floatCloud: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        waveWater: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        modalFadeIn: {  // ✅ Added modal fade-in animation
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        flicker: 'flicker 1s infinite',
        pulseIce: 'pulseIce 2s infinite',
        floatCloud: 'floatCloud 3s ease-in-out infinite',
        waveWater: 'waveWater 2s ease-in-out infinite',
        modalFadeIn: 'modalFadeIn 0.3s ease-out forwards',  // ✅ Added animation reference
      },
      colors: {
        fire: '#FF4500',
        water: '#1E90FF',
        cloud: '#B0C4DE',
        ice: '#AFEEEE',
      },
    },
  },
  plugins: [],
}
