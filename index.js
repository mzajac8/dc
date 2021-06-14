require('source-map-support').install();

if (process.env.NODE_ENV === 'test') {
  const tempy = require('tempy')
  process.env.TEST_DIR = tempy.directory()
}
require('./tsc-dist/main')
