const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const { createShutter } = require('../../../src')

// Restore snapshot in case it was updated by previous runs
fs.copyFileSync(path.join(__dirname, 'button.restore.png'), path.join(__dirname, 'snapshots', 'button.png'))

const shutter = createShutter(__dirname)

Promise.resolve()
  .then(() => shutter.snapshot('button', '<button>Click me!</button>'))
  .then(() => shutter.finish())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
