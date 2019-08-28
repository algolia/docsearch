import baseConfig from './webpack.config.jsdelivr.babel';
import { join } from 'path';

export default {
  ...baseConfig,
  devServer: {
    contentBase: join(__dirname, 'dist/cdn'),
    host: '0.0.0.0',
    compress: true,
    hot: true,
    inline: true,
    noInfo: true,
  },
};
