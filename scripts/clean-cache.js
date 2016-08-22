const findCacheDir = require('find-cache-dir');
const del = require('del');

const cacheDir = findCacheDir({ name: 'electron-react-app' });

module.exports = () =>
  del([cacheDir], { dot: true });
