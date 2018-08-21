---
title: React Testing
---

# React Component Tests

Create a new test file for a React component of yours. In the following example we will assume you have a component `Button`. There are virtually no restrictions about how to name and where to put the test file. Just make sure your test runner (Jest, Mocha, ...) will find it.

```jsx
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

That is basically it. Now run the tests for the first time and make sure they complete successfully. The first test run should always succeed, since there are no snapshots to compare to yet. The first test run will create a `snapshots` directory and save the snapshots there.

When running this test again, `@shutter/react` will again render your button in the desired states and compare the resulting snapshots to your previous component snapshots. The tests will fail with an overview of the failed tests if the snapshots don't match.

It will also print an inspection URL which links to the shutter.sh web app where you can see the rendered component, the expected outcome and a visual diff between them.

## Custom render function

You can pass a custom render function to `createReactShutter()` or `shutter.snapshot()`. Use it wrap your components in other components, like context providers.

The render function takes a React element and returns a promise resolving to a string of static HTML. The default render function, exported as `renderComponent`, is just a thin wrapper around `ReactDOMServer.renderToStaticMarkup()`.

This example sets up a shutter instance that will wrap the components in a Redux store provider:

```jsx
import createReactShutter, { renderComponent as baseRender } from '@shutter/react'
import { Provider } from 'react-redux'
import store from './store'

const render = (element) => {
  return baseRender(
    <Provider store={store}>
      {element}
    </Provider>
  )
}

const shutter = createReactShutter(__dirname, { render })

// ...
// await shutter.snapshot('My component', <Component />)
```

## Using AVA

AVA is quite popular for its lean and clean test API. You can easily write tests using shutter as well:

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


# CLI

First make sure the `shutter` package is installed:

```sh
$ npm install --save-dev shutter
```

Change your component that we wrote a test for in the last step, so that the new snapshot won't match the old one anymore. You will see an overview of the failed test cases.

What if this change was intentional? You want to update your locally stored snapshot(s), so the tests succeed again and future test runs will compare to the new visual appearance.

Let's update the snapshots using the `shutter` command line tool:

```sh
# `npx` comes with npm and will run shutter from ./node_modules/.bin/shutter
$ npx shutter update
```

You will see an interactive prompt that allows you to select the snapshots you want to update. Select them with Space and confirm with Enter, that's it.

<p class="text-center">
  <img alt="Shutter CLI in action" src="./images/shutter-cli.png" style="max-width: 100%" />
</p>

If you need detailed usage information for the `shutter` command line tool, just run `npx shutter --help`.
