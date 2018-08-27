---
title: React Components
description: How to test React.js components.
---

# React Component Tests

## Setup

First, install the necessary packages:

```bash
npm install --save-dev @shutter/react react react-dom
```

You will need to authenticate to the shutter service in order to use it. Check out the [section in the *Getting Started* guide](../getting-started#authentication) if you haven't yet.


## Write a test

Create a new test file for a React component of yours. There are no hard restrictions about how to name and where to put the test file. Just put it where you usually place your component tests and make sure your test runner (Jest, Mocha, ...) will find it.

Here is an example testing a `Button` component, using good old [Mocha](https://mochajs.org/) as the test runner.

```jsx
// src/components/button.shutter.js

import createReactShutter from '@shutter/react'
import Button from './button'

const shutter = createReactShutter(__dirname)

describe('Button component', function () {
  after(async function () {
    // Collect and evaluate results once we are done
    await shutter.finish()
  })

  it('matches visual snapshot', async function () {
    await Promise.all([
      shutter.snapshot('Default Button', <Button label='Click me' />),
      shutter.snapshot('Primary Button', <Button primary label='Click me' />)
    ])
  })
})
```


## Run the test

Let's now run the tests for the first time and make sure they complete successfully. The first test run should always succeed, since there are no snapshots to compare to yet.

```bash
$ npx mocha
```

The first test run will create a `snapshots` directory and save the snapshots there as PNG images.

When running this test again, `@shutter/react` will once more render your button and compare the resulting snapshots to your previous component snapshots. The tests will fail if the snapshots don't match, printing a list of the failed test cases and an inspection link.

The inspection link references the shutter.sh web app where you can see the rendered components, the expected outcomes and a visual diff between them.


## Custom render function

You can pass a custom render function to `createReactShutter()` or `shutter.snapshot()`. Use it to wrap your components in other components, like context providers.

The render function takes a React element and returns a promise resolving to a string of static HTML. The default render function, exported as `renderComponent`, just calls `ReactDOMServer.renderToStaticMarkup()`.

This example sets up a shutter instance that will wrap the components in a Redux store provider:

```jsx
import createReactShutter, { renderComponent } from '@shutter/react'
import { Provider } from 'react-redux'
import store from './store'

const render = (element) => {
  return renderComponent(
    <Provider store={store}>
      {element}
    </Provider>
  )
}

const shutter = createReactShutter(__dirname, { render })

// ...
// await shutter.snapshot('My component', <Component />)
```


## CLI & Updating snapshots

First make sure the `shutter` package is installed:

```bash
$ npm install --save-dev shutter
```

Change your component, so that the new snapshot won't match the old one anymore. Run the tests and you will see an overview of the failed test cases.

What if this change was intentional? You want to update your locally stored snapshot(s), so the tests succeed again and future test runs will compare to the new visual appearance.

Let's update the snapshots using the `shutter` command line tool:

```bash
# `npx` comes with npm and will run shutter from ./node_modules/.bin/shutter
$ npx shutter update
```

You will see an interactive prompt that allows you to select the snapshots you want to update. Select them with Space and confirm with Enter, that's it.

<p class="text-center">
  <img alt="Shutter CLI in action" src="/images/shutter-cli.png" style="max-width: 700px" />
</p>

If you need detailed usage information for the `shutter` command line tool, just run `npx shutter --help`.


## Custom `<head>`

The `<head>` section of the HTML document is easily customizable.

```jsx
import createReactShutter from '@shutter/react'

const head = (
  <>
    <link href='https://fonts.googleapis.com/css?family=Fjalla+One|Roboto|Catamaran:200' rel='stylesheet' />
  </>
)
const shutter = createReactShutter(__dirname, { head })
```


## Submit local files

You can submit local files that will be served on a path of your choice while rendering. This way you can use custom stylesheets, for instance.

```jsx
import createReactShutter, { addFile } from '@shutter/react'
import * as path from 'path'

const files = await Promise.all([
  addFile(path.join(__dirname, 'styles/base.css'), '/base.css')
])
const head = (
  <>
    <link href='/base.css' rel='stylesheet' />
  </>
)
const shutter = createReactShutter(__dirname, { files, head })
```

Please note that the submitted file will be publicly accessible.


## Using AVA

The test runner [AVA](https://github.com/avajs/ava) is quite popular for its lean and clean test API. You can easily write tests using shutter as well:

```js
import createReactShutter from '@shutter/react'
import Button from './button'

const shutter = createReactShutter(__dirname)

test.after(async () => {
  await shutter.finish()
})

test('Button', async t => {
  await Promise.all([
    shutter.snapshot('Default button', <Button label='Click me' />),
    shutter.snapshot('Primary button', <Button primary label='Click me' />)
  ])
  t.pass()
})
```
