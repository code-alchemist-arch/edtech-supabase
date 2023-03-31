const { violet, blackA, mauve, green } = require('@radix-ui/colors');


module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#EEEEEE',
          base: '#E9E9E9',
          main: '#FDFFF5',
        },
        black: {
          light: '#333333',
          base: '#1B1B1B',
          dark: '#000000',
        },
        purple: '#7e5bef',
        pink: '#ff49db',
        orange: '#ff7849',
        green: {
          light: '#61a63126',
          dark: '#6FC59B',
          opacid: 'rgba(97, 166, 49, 0.15)'
        },
        yellow: '#ffc82c',
        grey: {
          200: '#EEF2F8',
          500: '#94A0B4',
          600: '#717E95',
          dark: '#656572',
        },
        lightgrey: '#858585',
        ...mauve,
        ...violet,
        ...green,
        ...blackA,
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        4.5: '1.15rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        7.5: '1.875rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.156rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        58: '14.25rem',
        60: '15rem',
        62: '15.75rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
        100: '30rem',
      },
      fontSize: {
        sm: '0.8rem',
        '1sm': '0.875rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '2.5xl': '1.75rem',
        '3xl': '1.875rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'signin-outline': '0 2px 30px rgba(0, 0, 0, 0.5)',
        'instructor-card': '0px 1px 4px rgba(0, 0, 0, 0.1)'
        //box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.5);
      }
    },
  },
  plugins: [],
};
