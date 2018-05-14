import test from 'ava'
import * as React from 'react'
import createReactShutter from '../src'

require('dotenv').load()

test('can render a react component', async t => {
  const Button = (props: { label: string }) => <button>{props.label}</button>
  const shutter = createReactShutter(__dirname)

  await shutter.snapshot('Sample button', <Button label='I am a button' />)
  await shutter.finish()
  t.pass()
})
