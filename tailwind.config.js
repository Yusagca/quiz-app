export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        sixtyfour: ['Sixtyfour Convergence', 'cursive'],
        pacifico: ['Pacifico', 'cursive']
      },
      animation: {
        'slide-in': 'slideIn 1.5s ease-out',
        'glow-effect': 'glowEffect 1.5s ease-out infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        },
        glowEffect: {
          '0%': { 
            boxShadow: '0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 45px #ff00ff, 0 0 60px #ff00ff'
          },
          '50%': { 
            boxShadow: '0 0 40px #ff00ff, 0 0 60px #ff00ff, 0 0 80px #ff00ff, 0 0 100px #ff00ff'
          },
          '100%': { 
            boxShadow: '0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 45px #ff00ff, 0 0 60px #ff00ff'
          }
        }
      }
    }
  },
  plugins: [],
};
