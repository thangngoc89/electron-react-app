/**
 * React App SDK (https://github.com/kriasoft/react-app)
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const run = require('../run');

module.exports = () => Promise.resolve()
  .then(() => run('clean-dist'))
  .then(() => run('bundle'));