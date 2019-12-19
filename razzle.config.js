/**
 * Replace with custom razzle config when needed.
 * @module razzle.config
 */

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const jsConfig = require('./jsconfig').compilerOptions;
const path = require('path');
const fs = require('fs');
const { map } = require('lodash');
const glob = require('glob').sync;

const pathsConfig = jsConfig.paths;
let voltoPath = './node_modules/@plone/volto';
Object.keys(pathsConfig).forEach(pkg => {
  if (pkg === '@plone/volto') {
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig[pkg][0]}`;
  }
});


let config = require(`${voltoPath}/razzle.config`);
const razzleModify = config.modify;

const projectRootPath = path.resolve('.');

addonsPaths = Object.values(pathsConfig).map(value => `${jsConfig.baseUrl}/${value[0]}/`)

razzleModify.addonCustomizationPaths = ['src/addons/customizations/'];
function customizeAddons(addonCustomizationPaths, addonPath) {
  const addonCustomizations = {}
  addonCustomizationPaths.forEach(customizationPath => {
    map(
      glob(
        `${customizationPath}**/*.*(svg|png|jpg|jpeg|gif|ico|less|js|jsx)`,
      ),
      filename => {
        const targetPath = filename.replace(
          customizationPath,
          addonPath,
        );
        if (fs.existsSync(targetPath)) {
          addonCustomizations[
            filename
              .replace(customizationPath, path.join(projectRootPath, addonPath))
              .replace(/\.(js|jsx)$/, '')
          ] = path.resolve(filename);
        } else {
          console.log(
            `The file ${filename} doesn't exist in the volto package (${targetPath}), unable to customize.`,
          );
        }
      },
    );
  });
  return addonCustomizations
}
razzleModify.customizeAddons = customizeAddons
razzleModify.addonCustomizations = []
addonsPaths.forEach(addonPath => {
  razzleModify.addonCustomizations = [...razzleModify.addonCustomizations, razzleModify.customizeAddons(razzleModify.addonCustomizationPaths, addonPath)]
})

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const vc = razzleModify(config, { target, dev }, webpack);

    razzleModify.addonCustomizations.forEach(cust => {
      if(Object.keys(cust).length) {
        vc.resolve.alias = {
          ...vc.resolve.alias,
          ...cust
        };
      }
    })
    // vc.module.rules.forEach((rule, i) => {
    //   console.log('rule', i, '-----');
    //   console.log(rule);
    //   console.log('rule options');
    //   console.log(rule.use && rule.use[0].options);
    // });
    // const hardSource = new HardSourceWebpackPlugin();
    // vc.plugins.push(hardSource);
    return vc;
  },
};
