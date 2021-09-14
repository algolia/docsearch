module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
  darkMode: 'class',
  corePlugins: { preflight: false, container: false },
  important: '#tailwind',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
