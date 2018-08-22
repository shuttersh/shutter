import test from 'ava'
import * as path from 'path'
import createShutter, { addFile } from '../src'

require('dotenv').load()

test('can submit local files', async t => {
  const files = [
    await addFile(
      path.join(__dirname, 'fixtures/dark-bg-centered.css'),
      '/base.css'
    )
  ]
  const head = `
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link href="/base.css" rel="stylesheet" />
  `
  const renderOptions = { autoCrop: false }
  const shutter = createShutter(__dirname, { files, head, renderOptions })
  await shutter.snapshot('Content styled by local stylesheet', '<main>I have been styled by a local CSS file.</main>')
  await shutter.finish()
  t.pass()
})
