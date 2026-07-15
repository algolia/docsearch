export const defines = {
  __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  'process.env.NODE_ENV': JSON.stringify('production'),
};

export const pkgExports = {
  enabled: true,
  packageJson: false,
  legacy: true,
  inlinedDependencies: false,
};
