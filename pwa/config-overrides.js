const CopyPlugin = require('copy-webpack-plugin');
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = (config, env) => {
  if (env !== 'production') {
    return config;
  }

  config.plugins.unshift(
    new CopyPlugin({
      patterns: [
        // Assets
        {
          from: path.resolve(__dirname, 'public'),
          to: '.',
          globOptions: {
            ignore: ['**/.DS_Store'],
          },
        },
      ],
    }),
  );

  const workboxPluginIndex = config.plugins.findIndex(
    (element) => element instanceof GenerateSW,
  );

  const injectManifestPlugin = new InjectManifest({
    swSrc: path.resolve(__dirname, 'src/serviceWorker/index.ts'),
    swDest: './sw.js',
    exclude: [
      /icons\//,
      /\.map$/,
      /\.LICENSE/,
      /asset-manifest\.json$/,
      /(?:^|\/)\..+$/,
    ],
  });

  if (workboxPluginIndex > -1) {
    config.plugins[workboxPluginIndex] = injectManifestPlugin;
  } else {
    config.plugins.push(injectManifestPlugin);
  }

  return config;
};
