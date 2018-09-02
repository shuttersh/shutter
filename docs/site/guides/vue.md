---
title: Vue Components
description: How to test Vue.js components.
date: 2018-09-02
---

# Vue Component Tests

[[toc]]

## Setup

First, install the necessary packages:

```bash
npm install --save-dev @shutter/vue vue
```

You will need to authenticate to the shutter service in order to use it. Check out the [section in the *Getting Started* guide](../getting-started#authentication) if you haven't yet.


## Write a test

Create a new test file for a Vue component of yours. There are no hard restrictions about how to name and where to put the test file. Just put it where you usually place your component tests and make sure your test runner (Jest, Mocha, ...) will find it.

Here is an example testing a `MyButton` component, using good old [Mocha](https://mochajs.org/) as the test runner.

```js
// src/components/MyButton.shutter.js

import createVueShutter from '@shutter/vue'
import MyButton from './MyButton'

const shutter = createVueShutter(__dirname)

describe('Button component', function () {
  after(async function () {
    // Collect and evaluate results once we are done
    await shutter.finish()
  })

  it('matches visual snapshot', async function () {
    await Promise.all([
      shutter.snapshot('Default Button', {
        components: { MyButton },
        template: '<my-button label='Click me'></my-button>'
      }),
      shutter.snapshot('Primary Button',  {
        components: { MyButton },
        template: '<my-button primary label='Click me'></my-button>'
      })
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

When running this test again, `@shutter/vue` will once more render your button and compare the resulting snapshots to your previous component snapshots. The tests will fail if the snapshots don't match, printing a list of the failed test cases and an inspection link.

The inspection link references the shutter.sh web app where you can see the rendered components, the expected outcomes and a visual diff between them.

## CLI & Updating snapshots

First make sure the `shutter` package is installed:

```bash
$ npm install --save-dev shutter
```

Change your component, so that the new snapshot won't match the old one anymore. Run the tests and you will see an overview of the failed test cases.

What if this change was intentional? You want to update your locally stored snapshot(s), so the tests succeed again and future test runs will compare to the new visual appearance.

Let's update the snapshots using the `shutter` command line tool:

```bash
# `npx` comes with npm > 5.2 and will run shutter from ./node_modules/.bin/shutter
$ npx shutter update
```

You will see an interactive prompt that allows you to select the snapshots you want to update. Select them with Space and confirm with Enter, that's it.

<p class="text-center">
  <img alt="Shutter CLI in action" src="/images/shutter-cli.png" style="max-width: 700px" />
</p>

If you need detailed usage information for the `shutter` command line tool, just run `npx shutter --help`.

## Using AVA

The test runner [AVA](https://github.com/avajs/ava) is quite popular for its lean and clean test API. You can easily write tests using shutter as well:

```js
import createVueShutter from '@shutter/vue'
import MyButton from './MyButton'

const shutter = createVueShutter(__dirname)

test.after(async () => {
  // Collect and evaluate results once we are done
  await shutter.finish()
})

test('Button', async t => {
  await Promise.all([
    shutter.snapshot('Default Button', {
      components: { MyButton },
      template: '<my-button label='Click me'></my-button>'
    }),
    shutter.snapshot('Primary Button',  {
      components: { MyButton },
      template: '<my-button primary label='Click me'></my-button>'
    })
  ])
  t.pass()
})
```
