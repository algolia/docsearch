export default {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
  corePlugins: { preflight: false, container: false },
  important: '#tailwind',
  theme: {
    extend: {
      colors: {
        algolia: '#1C52FF',
      },
      maxWidth: {
        xxs: '18rem',
      },
    },
  },
};
