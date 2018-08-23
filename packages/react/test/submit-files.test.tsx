import test from 'ava'
import React from 'react'
import * as path from 'path'
import createReactShutter, { addFile } from '../src'

require('dotenv').load()

// Based on <https://medium.com/@AmJustSam/how-to-do-css-only-frosted-glass-effect-e2666bafab91>
const GlassBox = (props: { children: React.ReactNode }) => (
  <div className='glassbox'>
    <div className='glassbox-content'>
      {props.children}
    </div>
  </div>
)

test('can submit and apply a local stylesheet', async t => {
  const files = await Promise.all([
    addFile(path.join(__dirname, 'fixtures/background.webp'), '/background.webp'),
    addFile(path.join(__dirname, 'fixtures/glassbox.css'), '/glassbox.css')
  ])
  const head = <link href='/glassbox.css' rel='stylesheet' />
  const shutter = createReactShutter(__dirname, { files, head })

  await shutter.snapshot('Glassbox', (
    <GlassBox>
      Glassbox styled by custom local stylesheet.
    </GlassBox>
  ))
  await shutter.finish()
  t.pass()
})
