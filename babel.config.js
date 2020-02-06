const baseCfg = require('@plone/volto/babel');
// "react-loadable/babel"

module.exports = function(api) {
  const voltoConfig = baseCfg(api);
  const presets = voltoConfig.presets;
  const plugins = [...voltoConfig.plugins, 'transform-es2015-modules-commonjs'];
  return {
    plugins,
    presets,
    sourceType: 'unambiguous',
  };
};
