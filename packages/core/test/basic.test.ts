import test from 'ava'
import createShutter from '../src'

require('dotenv').load()

test('snapshot matching expectation passes', async t => {
  const shutter = createShutter(__dirname)
  await shutter.snapshot('button matching expectation', '<button>Click me!</button>')
  await shutter.finish()
  t.pass()
})

test('snapshot not matching expectation fails', async t => {
  const shutter = createShutter(__dirname)
  await shutter.snapshot('button not matching expectation', '<button style="color: red">Click me!</button>')
  const error = await t.throws(shutter.finish())
  t.regex(error.message, /Shutter tests failed\./)
  t.regex(error.message, /✖ button not matching expectation/)
})
