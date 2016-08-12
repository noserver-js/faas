const glob = require('glob');
const path = require('path');
const fs = require('fs');

const options = {
  ignore: ['**/node_modules/**']
};

const find = () => new Promise((resolve, reject) => {
  glob('**/*/package.json', options, (err, files) => {
    if (err) {
      reject(err);
    } else {
      resolve(files);
    }
  });
});

module.exports = () => {
  return find().then(files => {
    const mainPackage = path.resolve('package.json');
    let routeAliases = {};

    if (fs.existsSync(mainPackage)) {
      const mainPackageJSON = JSON.parse(fs.readFileSync(mainPackage).toString());
      routeAliases = mainPackageJSON['route-aliases'] || {};
    }

    const methods = {};
    const context = {
      routeAliases
    };

    for (const file of files) {
      const dirname = path.dirname(file);
      const absolute = path.resolve(dirname);
      const required = require(absolute);

      Object.assign(methods, required);

      const packageSource = fs.readFileSync(file);
      const {name, version, routes} = JSON.parse(packageSource);

      if (!context[name]) {
        context[name] = {};
      };

      if (!context[name][version]) {
        context[name][version] = {};
      }

      context[name][version].routes = routes || {};
      context[name][version].methods = Object.keys(required);
    }

    return {methods, context};
  });
};
