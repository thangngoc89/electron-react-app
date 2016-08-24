const del = require('del');

module.exports = () =>
  del(['app/dist/*'], { dot: true });
