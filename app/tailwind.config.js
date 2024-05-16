export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': 'var(--white)',
      'black': 'var(--black)',
      'yellow': '#fcd607',
      'green': {
        light: '#48ffd0',
        DEFAULT: '#09f4bc',
        dark: '#00dda4',
      },
      'pink': {
        light: '#ff85aa',
        DEFAULT: '#ff688f',
        dark: '#e14b76',
      },
    },
    extend: {
      fontFamily: {
        'sans': ['Fredoka', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
