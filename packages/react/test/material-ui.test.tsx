import test from 'ava'
import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import createReactShutter, { BuiltinRenderFunction } from '../src'

require('dotenv').load()

const render = async (element: React.ReactElement<any>, originalRender: BuiltinRenderFunction) => {
  return originalRender(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme, { userAgent: 'all' })}>
      {element}
    </MuiThemeProvider>
  )
}

test('Material UI components', async t => {
  const shutter = createReactShutter(__dirname, { render })

  await shutter.snapshot('AppBar', <AppBar title='Demo AppBar' />)
  await shutter.snapshot('RaisedButton', <RaisedButton label='Default raised button' />)
  await shutter.snapshot('Primary RaisedButton', <RaisedButton label='Primary raised button' primary />)

  await shutter.finish()
  t.pass()
})
