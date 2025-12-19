/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- AGREGA ESTO A TU CONFIGURACIÓN EXISTENTE ---
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-in forwards',
        'zoom-in-elastic': 'zoomInElastic 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        zoomInElastic: {
          '0%': { opacity: '0', transform: 'scale(0.5) rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-3deg)' }, // Termina un poco inclinado
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(-3deg)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05) rotate(-3deg)' },
        }
      }
      // --------------------------------------------------
    },
  },
  plugins: [],
}