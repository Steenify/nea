// config-overrides.js
const { useBabelRc, override } = require('customize-cra');

function myOverrides(config) {
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' },
  });
  config.output.globalObject = 'this';
  return config;
}

module.exports = override(myOverrides, useBabelRc());
