const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const pkg = require('./package.json');

if (process.argv.includes('--test-sdk')) {
  process.env.TEST_SDK = true;
  const tempDir = path.resolve(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  process.chdir(tempDir);
}

if (process.argv.includes('--verbose')) {
  process.env.VERBOSE = true;
}

function checkIfCurrentWorkingDirectoryIsEmpty() {
  return new Promise(resolve => {
    console.log(`Scaffolding a new JavaScript application in ${process.cwd()}`);

    // Check if the current directory is empty
    const files = fs.readdirSync(process.cwd());
    if (files.filter(x => x !== '.git').length) {
      console.log('The current directory is not empty.');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      process.stdout.write('Are you sure you want to proceed? (y/N)? ');
      process.stdin.once('keypress', key => {
        console.log();
        rl.close();
        if (key === 'y' || key === 'Y') {
          resolve();
        } else {
          process.exit(0);
        }
      });
    } else {
      resolve();
    }
  });
}

function installReactTools() {
  // Don't install electron-react-app-scripts in test mode
  if (process.env.TEST_SDK === 'true') {
    return Promise.resolve();
  }

  // Create an empty package.json file if it doesn't exist
  const filename = path.resolve(process.cwd(), 'package.json');
  try {
    fs.accessSync(filename, fs.F_OK);
  } catch (e) {
    fs.writeFileSync(filename, '{}', 'utf8');
  }

  return new Promise((resolve, reject) => {
    const tagMatch = pkg.version.match(/-([a-z]+)\./); // '1.0.0-beta.2' => 'beta'
    const module = tagMatch
      ? `electron-react-app-scripts@${tagMatch[1]}`
      : 'electron-react-app-scripts';
    console.log(`Installing '${module}' from npm... This may take a couple minutes.`);

    const npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
    const options = { stdio: ['ignore', 'inherit', 'inherit'] };

    spawn(npm, ['install', module, '--save-dev'], options).on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to install '${module}'.`));
      }
    });
  });
}

function run(command) {
  if (process.env.TEST_SDK === 'true') {
    // eslint-disable-next-line global-require
    return require(path.resolve(__dirname, '../run'))(command);
  }
  // eslint-disable-next-line global-require, import/no-unresolved
  return require(
    path.resolve(process.cwd(), './node_modules/electron-react-app-scripts/run')
  )(command);
}

const command = process.argv[2];

if (process.argv.includes('--production') || process.argv.includes('--prod')) {
  process.env.APP_ENV = 'production';
} else if (process.argv.includes('--staging')) {
  process.env.APP_ENV = 'staging';
} else if (process.argv.includes('--test')) {
  process.env.APP_ENV = 'test';
} else {
  process.env.APP_ENV = (command === 'run' || command === 'start') ? 'development' : 'production';
}

if (command === 'start' || command === 'run') {
  process.env.HMR = !process.argv.includes('--no-hmr');
  if (process.argv.includes('--release') || process.argv.includes('-r')) {
    process.env.NODE_ENV = 'production';
  } else {
    process.env.NODE_ENV = 'development';
  }
} else {
  process.env.HMR = process.argv.includes('--hmr');
  if (process.argv.includes('--debug') || process.argv.includes('-d')) {
    process.env.NODE_ENV = 'development';
  } else {
    process.env.NODE_ENV = 'production';
  }
}

if (command === 'new') {
  Promise.resolve()
    .then(() => checkIfCurrentWorkingDirectoryIsEmpty())
    .then(() => installReactTools())
    .then(() => (process.env.TEST_SDK === 'true'
      // eslint-disable-next-line global-require
      ? require(path.resolve(__dirname, '../scripts/new'))()
      // eslint-disable-next-line global-require, import/no-unresolved
      : require(path.resolve(
          process.cwd(),
          './node_modules/electron-react-app-scripts/scripts/new')
        )())
    )
    .catch(err => {
      console.error(process.argv.includes('--verbose') ? err.stack : `ERROR: ${err.message}`);
      process.exit(1);
    });
} else if (/^[a-z0-9:\-.]+$/.test(command || '')) {
  console.log(
    `Environment: ${process.env.APP_ENV}, ` +
    `build: ${process.env.NODE_ENV === 'development'
      ? 'debug (non-optimized)' : 'release (optimized)'}, ` +
    `HMR: ${process.env.HMR === 'true' ? 'true' : 'false'}`
  );
  run(command)
    .catch(err => {
      console.error(process.argv.includes('--verbose') ? err.stack : `ERROR: ${err.message}`);
      process.exit(1);
    });
} else {
  console.log(' Usage: electron-react-app <command> [options]');
  console.log();
  console.log(' Commands:');
  console.log();
  console.log('   new     - Scaffold a new Electron application project');
  console.log('   build   - Compile React application with Webpack');
  console.log('   start   - Compile and launch the app in development mode');
  console.log();
  console.log(' Options:');
  console.log();
  console.log('   --production, or  - Execution environment');
  console.log('   --development, or');
  console.log('   --staging, or');
  console.log('   --test');
  console.log();
  console.log('   --release, or     - Build configuration (optimized/minimized vs not-optimized)');
  console.log('   --debug');
  console.log();
  console.log('   --no-hmr          - Disable Hot Module Replacement (HMR)');
  console.log('   --verbose         - Print more information to the console');
  console.log('   -v, --version     - Print React App SDK version');
  console.log();
  console.log(' For more information visit:');
  console.log();
  console.log('   https://github.com/thangngoc89/electron-react-app');
}
