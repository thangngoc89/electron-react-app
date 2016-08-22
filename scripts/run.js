const webpack = require('webpack');
const chalk = require('chalk');
const { spawn } = require('child_process');

function openElectronApp() {
  const child = spawn('electron', ['./app/electron.main.js', '--enable-logs']);
  const prefix = 'electron> ';
  child.stdout.on('data', (data) => {
    console.log(chalk.blue(
      prefix + data.toString().replace(/\n$/g, '').split('\n').join(`\n ${prefix}`)
    ));
  });
  child.stderr.on('data', (data) => {
    console.error(chalk.red(
      prefix + data.toString().replace(/\n$/g, '').split('\n').join(`\n ${prefix}`)
    ));
  });
  child.on('close', (code) => {
    console.log(chalk.yellow(`Electron exited with status ${code}`));
    process.exit(code);
  });
  child.on('error', (error) => {
    console.log(chalk.red(`Error launching electron:\n ${error}`));
  });
}

module.exports = config => (
  new Promise(resolve => {
    let count = 0;
    const compiler = webpack(config.webpack);
    compiler.plugin('invalid', () => {
      console.log('Compiling...');
    });

    compiler.plugin('done', () => {
      // Start electron after first complie
      if (++count === 1) {
        console.log(chalk.cyan('Starting electron...'));
        openElectronApp();
      }
    });
    const Dashboard = require('webpack-dashboard');
    const DashboardPlugin = require('webpack-dashboard/plugin');

    const dashboard = new Dashboard();
    compiler.apply(new DashboardPlugin(dashboard.setData));

    // Start dev server with webpack dev and hot middleware
    const express = require('express');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    const server = express();
    server.use(devMiddleware(compiler, {
      publicPath: config.webpack.output.publicPath,
      quiet: true,
    }));

    server.use(hotMiddleware(compiler, {
      log: () => {},
    }));

    server.listen(3000, (err) => {
      if (err) {
        console.error(err);
      }

      console.log(chalk.cyan(
        'Development server listening at http://localhost:3000/'
      ));

      resolve();
    });
  })
);
