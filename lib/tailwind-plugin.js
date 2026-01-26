const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities }) {
  const customSizes = {
    'text-10': {
      'font-size': '10px',
      'line-height': '14px',
    },
    'text-12': {
      'font-size': '12px',
      'line-height': '16px',
    },
    'text-14': {
      'font-size': '14px',
      'line-height': '20px',
    },
    'text-16': {
      'font-size': '16px',
      'line-height': '24px',
    },
    'text-18': {
      'font-size': '18px',
      'line-height': '22px',
    },
    'text-20': {
      'font-size': '20px',
      'line-height': '24px',
    },
    'text-24': {
      'font-size': '24px',
      'line-height': '30px',
    },
    'text-26': {
      'font-size': '26px',
      'line-height': '32px',
    },
    'text-30': {
      'font-size': '30px',
      'line-height': '38px',
    },
    'text-36': {
      'font-size': '36px',
      'line-height': '44px',
    },
  };

  addUtilities(customSizes, ['responsive']);
});