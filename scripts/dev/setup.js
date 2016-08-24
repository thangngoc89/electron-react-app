const path = require('path');
const spawn = require('cross-spawn');
const pkg = require('../../templates/package.json');

const spawnPromise = (...args) => (
  new Promise((resolve, reject) => {
    spawn(...args).on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject('Failed to install npm package(s).');
      }
    });
  })
);

const install = () => {
  const cwd = path.resolve(__dirname, '../../templates');
  const npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
  const options = { stdio: ['ignore', 'inherit', 'inherit'], cwd };
  const dependencies = Object.assign({}, pkg.dependencies, pkg.devDependencies);

  const installArgs = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const pkgName in dependencies) {
    if (
      // eslint-disable-next-line no-prototype-builtins
      dependencies.hasOwnProperty(pkgName) &&
      pkgName !== 'electron-react-app-scripts'
    ) {
      installArgs.push(`${pkgName}@${dependencies[pkgName]}`);
    }
  }

  return spawnPromise(npm, ['install', ...installArgs], options)
      .then(() => spawnPromise(npm, ['link', '../'], options));
};

install();
