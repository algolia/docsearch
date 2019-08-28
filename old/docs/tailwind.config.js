/* eslint-disable import/no-commonjs */
/* Note: this file is used for styling the documentation website, not the javascript
 * dropdown. */
const _ = require('lodash');
const algoliaColors = {
  moon: '#f5f5fa',
  proton: '#c5c9e0',
  nova: '#848ab8',
  telluric: '#5d6494', // Text
  solstice: '#3a416f', // Headers
  cosmos: '#21243d',
  nebula: '#5468ff', // links

  'moon--1': '#EBEBF2', // input focus

  'neptune-2': '#3A46A1',
  'neptune-1': '#5560B5',
  neptune: '#707BCC',
  'neptune--1': '#8D97E3',
  'neptune--2': '#A6B0F9',

  'mercury-2': '#008FBA',
  'mercury-1': '#2DA7CB',
  mercury: '#5BBFDD',
  'mercury--1': '#88d6ee',
  'mercury--2': '#b5eeff',

  'jupiter-2': '#3ab2bd',
  'jupiter-1': '#61c5c8',
  jupiter: '#89d9d3',
  'jupiter--1': '#b0ecde',
  'jupiter--2': '#d7ffe9',

  'saturn-2': '#ec8b63',
  'saturn-1': '#f3a57e',
  saturn: '#f8be9a',
  'saturn--1': '#fcd7b7',
  'saturn--2': '#fdf1d4',

  'mars-2': '#ed5a6a',
  'mars-1': '#f27885',
  mars: '#f695a0',
  'mars--1': '#fbb3ba',
  'mars--2': '#ffd0d5',

  'venus-2': '#ae3e88',
  'venus-1': '#d44fa4',
  venus: '#ea71bc',
  'venus--1': '#f89ad3',
  'venus--2': '#ffcae9',
};
const colors = {
  ...algoliaColors,
  transparent: 'transparent',
  inherit: 'inherit',
  'white-pure': '#FFF',
  'black-pure': '#000',
  white: algoliaColors.moon,
  black: algoliaColors.cosmos,
  grey: algoliaColors.proton,
  'grey-1': algoliaColors.nova,
  'grey-2': algoliaColors.telluric,
  'grey-3': algoliaColors.solstice,

  red: algoliaColors.mars,
  orange: algoliaColors.saturn,
  yellow: algoliaColors['saturn--2'],
  green: algoliaColors.jupiter,
  teal: algoliaColors.mercury,
  blue: algoliaColors.nebula,
  indigo: algoliaColors.neptune,
  purple: algoliaColors['venus-2'],
  pink: algoliaColors.venus,

  // Alpha
  'black-10': 'rgba(0, 0, 0, .10)',
  'black-25': 'rgba(0, 0, 0, .25)',
  'black-50': 'rgba(0, 0, 0, .50)',
  'black-65': 'rgba(0, 0, 0, .65)',
  'black-75': 'rgba(0, 0, 0, .75)',
  'black-90': 'rgba(0, 0, 0, .90)',
  'white-10': 'rgba(255, 255, 255, .10)',
  'white-25': 'rgba(255, 255, 255, .25)',
  'white-50': 'rgba(255, 255, 255, .50)',
  'white-65': 'rgba(255, 255, 255, .65)',
  'white-75': 'rgba(255, 255, 255, .75)',
  'white-90': 'rgba(255, 255, 255, .90)',
};

const screenSizes = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

const dimensionScale = {
  auto: 'auto',
  '0': '0',
  '0x': '.25rem',
  '05': '.5rem',
  '05x': '.75rem',
  '1': '1rem',
  '1x': '1.5rem',
  '2': '2rem',
  '2x': '3rem',
  '3': '4rem',
  '3x': '6rem',
  '4': '8rem',
  '4x': '12rem',
  '5': '16rem',
  '10': '10%',
  '20': '20%',
  '25': '25%',
  '30': '30%',
  '33': 'calc(100% / 3)',
  '40': '40%',
  '50': '50%',
  '60': '60%',
  '66': 'calc(100% / 1.5)',
  '70': '70%',
  '75': '75%',
  '80': '80%',
  '90': '90%',
  '100': '100%',
  '100vw': '100vw',
  '100vh': '100vh',
  ...screenSizes,
};

const fontScale = {
  '-2': '0.75rem',
  '-1': '0.875rem',
  '0': '0px',
  '1': '1rem', // 16px
  '2': '1.125rem', // 18px
  '3': '1.25rem', // 20px
  '4': '1.5rem', // 24px
  '5': '1.875rem', // 30px
  '6': '2.25rem', // 36px
  '7': '3rem', // 48px
  '8': '3.5rem', // 56px
};

// Leading (line-height) uses values proportional to the current font-size.
// In addition, it also allows setting it to exact values found in the font and
// dimension scales.
// .leading-2 => Proportional to the current font size
// .leading-text-2 => Using exact font size
// .leading-h-2 => Using exact dimension size
const leadingScale = {
  0: '1',
  1: '1.25',
  2: '1.5',
};
_.each(dimensionScale, (value, key) => {
  leadingScale[`h-${key}`] = value;
});
_.each(fontScale, (value, key) => {
  leadingScale[`text-${key}`] = value;
});

const fontWeight = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const borderRadius = {
  '0': '0',
  '1': '.125rem',
  '2': '.25rem',
  '3': '.5rem',
  auto: '6px',
  '100': '9999px',
};

const zIndex = {
  auto: 'auto',
  '-2': -20,
  '-1': -10,
  '0': 0,
  '1': 10,
  '2': 20,
  '3': 30,
  '4': 40,
  '5': 50,
};

const opacity = {
  '0': '0',
  '15': '.15',
  '25': '.25',
  '50': '.5',
  '75': '.75',
  '100': '1',
};

const boxShadow = {
  button:
    '0 7px 14px -3px rgba(45, 35, 66, 0.3), 0 2px 4px 0 rgba(45, 35, 66, 0.4), inset 0 -2px 0 0 #cfd1e3',
  'button-up':
    '0 11px 16px -3px rgba(45, 35, 66, 0.3), 0 4px 5px 0 rgba(45, 35, 66, 0.4), inset 0 -2px 0 0 #cfd1e3',
  'button-down':
    'inset 0 2px 0 1px rgba(132, 138, 184, 0.11), inset 0 2px 9px 0 rgba(93, 100, 148, 0.5), inset 0 -1px 0 1px #fff',

  'button-primary':
    '0 7px 14px -3px rgba(45, 35, 66, 0.3), 0 2px 4px 0 rgba(45, 35, 66, 0.4), inset 0 -2px 0 0 #4b58ba;',
  'button-primary-up':
    '0 11px 16px -3px rgba(45, 35, 66, 0.3), 0 4px 5px 0 rgba(45, 35, 66, 0.4), inset 0 -2px 0 0 #4b58ba;',
  'button-primary-down':
    'inset 0 2px 0 1px rgba(132, 138, 184, 0.11), inset 0 2px 9px 0 rgba(93, 100, 148, 0.5), inset 0 -1px 0 1px #5468ff;',

  '1':
    '0 5px 15px 0 rgba(37, 44, 97, 0.15), 0 2px 4px 0 rgba(93, 100, 148, 0.2)',
  none: 'none',
};

// Use font-weight without prefixes (.bold, .thin, etc)
const customFontWeight = _.reduce(fontWeight, (result, value, key) =>
  _.assign(result, {
    [`${key}`]: { fontWeight: value },
  })
);
const customUtilities = {
  'text-outline': {
    'text-shadow':
      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
  },
  'bg-blur': {
    filter: 'blur(10px)',
  },
};
const customFlexbox = {
  flrnw: {
    flexDirection: 'row',
  },
  flrw: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flcnw: {
    flexDirection: 'column',
  },
  flcw: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  fln: {
    flex: 'none',
  },
  fla: {
    flex: '1 1 auto',
    minWidth: 0,
    minHeight: 0,
  },
  flccv: {
    justifyContent: 'center',
  },
  flcch: {
    alignItems: 'center',
  },
  flrcv: {
    alignItems: 'center',
  },
  flrch: {
    justifyContent: 'center',
  },
  flc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flral: {
    justifyContent: 'flex-start',
  },
  flrar: {
    justifyContent: 'flex-end',
  },
  flcat: {
    justifyContent: 'flex-start',
  },
  flcab: {
    justifyContent: 'flex-end',
  },
  flspa: {
    justifyContent: 'space-around',
  },
  flspb: {
    justifyContent: 'space-between',
  },
};
// Use the dimension scale for top/right/bottom/left positioning
const customPositions = _.reduce(
  dimensionScale,
  (result, value, key) =>
    _.assign(result, {
      [`top-${key}`]: { top: value },
      [`right-${key}`]: { top: value },
      [`bottom-${key}`]: { top: value },
      [`left-${key}`]: { top: value },
    }),
  {}
);
// Add calculated height and width with cropped parts, like .h-100vh-3
const customCroppedVhVw = _.reduce(
  dimensionScale,
  (result, value, key) => {
    // Only do it for simple scale and half/scales
    const isSimpleScale = key.length === 1;
    const isHalfScale = key.length === 2 && key[1] === 'x';
    if (!(isSimpleScale || isHalfScale)) {
      return result;
    }
    return _.assign(result, {
      [`h-100vh-${key}`]: { height: `calc(100vh - ${value})` },
      [`w-100vw-${key}`]: { width: `calc(100vw - ${value})` },
    });
  },
  {}
);

function addCustomClasses(customClasses) {
  return ({ addUtilities }) => {
    const prefixedClasses = _.mapKeys(customClasses, (value, key) => `.${key}`);
    addUtilities(prefixedClasses);
  };
}

const plugins = [
  addCustomClasses(customFontWeight),
  addCustomClasses(customFlexbox),
  addCustomClasses(customUtilities),
  addCustomClasses(customPositions),
  addCustomClasses(customCroppedVhVw),
];

module.exports = {
  theme: {
    width: dimensionScale,
    minWidth: dimensionScale,
    maxWidth: dimensionScale,
    height: dimensionScale,
    minHeight: dimensionScale,
    maxHeight: dimensionScale,
    padding: dimensionScale,
    margin: dimensionScale,

    fontSize: fontScale,

    lineHeight: leadingScale,

    fontWeight,

    colors,
    textColor: colors,
    backgroundColor: colors,
    borderColor: global.Object.assign(
      { default: colors['grey-light'] },
      colors
    ),

    zIndex,
    opacity,
    borderRadius,
    boxShadow,

    screens: {
      ...screenSizes,
      print: { raw: 'print' },
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '1': '2px',
      '2': '4px',
      '3': '8px',
    },
    fontFamily: {
      sans: [
        'system-ui',
        'BlinkMacSystemFont',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
      serif: [
        'Constantia',
        'Lucida Bright',
        'Lucidabright',
        'Lucida Serif',
        'Lucida',
        'DejaVu Serif',
        'Bitstream Vera Serif',
        'Liberation Serif',
        'Georgia',
        'serif',
      ],
      mono: [
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
    // Letter-spacing
    letterSpacing: {
      tight: '-0.05em',
      normal: '0',
      wide: '0.05em',
      poppins: '1.5px',
    },
    fill: {
      current: 'currentColor',
    },
    stroke: {
      current: 'currentColor',
    },
  },
  plugins,

  variants: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderColor: ['responsive', 'hover'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    flexGrow: ['responsive'],
    float: ['responsive'],
    fontFamily: ['responsive'],
    fontWeight: ['responsive', 'hover'],
    height: ['responsive'],
    lineHeight: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    opacity: ['responsive'],
    overflow: ['responsive'],
    padding: ['responsive'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    boxShadow: ['responsive', 'hover'],
    fill: [],
    stroke: [],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover'],
    fontSize: ['responsive'],
    textStyle: ['responsive', 'hover'],
    letterSpacing: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    zIndex: ['responsive'],
  },

  prefix: '',
  important: false,
  separator: '_',
};
