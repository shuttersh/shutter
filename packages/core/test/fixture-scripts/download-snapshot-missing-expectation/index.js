const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const { createShutter } = require('../../../src')

// Make sure there are no snapshots to match against
if (fs.readdirSync(__dirname).includes('snapshots')) {
  rimraf.sync(path.join(__dirname, 'snapshots'))
}

const shutter = createShutter(__dirname)

Promise.resolve()
  .then(() => shutter.snapshot('input with no expectation', '<input type="text" placeholder="Enter your name here">'))
  .then(() => shutter.finish())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
