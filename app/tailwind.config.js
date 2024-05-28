export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fcfdd3',
      black: '#1d092c',
      yellow: {
        light: '#ffea00',
        DEFAULT: '#fcd607',
        dark: '#b59b00'
      },
      orange: {
        light: '#ffab40',
        DEFAULT: '#ff9100',
        dark: '#ff6d00'
      },
      green: {
        light: '#48ffd0',
        DEFAULT: '#09f4bc',
        dark: '#00dda4'
      },
      pink: {
        light: '#ff85aa',
        DEFAULT: '#ff688f',
        dark: '#e14b76'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Fredoka', 'sans-serif']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
