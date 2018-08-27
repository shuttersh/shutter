---
title: Getting Started
description: Quick start guide showing how to get up and running.
---

# Getting Started

[[toc]]

## Sign up

The shutter.sh service is currently in closed alpha testing. You will need an invitation to use it until the service goes public.

If you would like to get invited, just ping us on [Twitter](https://twitter.com/shuttersh) or check out our [website](https://shutter.sh/) for other ways to get in touch.


## Installation

Open a terminal and go to your working project's directory to install the packages.

```bash
$ yarn add --dev shutter @shutter/react
```

The `shutter` package is the CLI tool that does authentication and snapshot updates. The `@shutter/react` package contains the React component snapshotting functionality.

Make sure that you installed `react` and `react-dom`:

```bash
$ yarn add react react-dom
```

Use your favorite test runner to write the tests, like Jest, AVA, Mocha, Tape ... The test examples that follow in this guide will be written using the Mocha / Jest API, since it is the most widely known one.


## Authentication

Log in to your account using the authentication token you received with your [invitation](#sign-up):

```bash
# `npx` comes with npm and will run shutter from ./node_modules/.bin/shutter
$ npx shutter authenticate YOURTOKENHERE
```

Your authentication token has now been saved to a `.shutterrc` file and we are ready to get productive.

<div class="alert alert-warning" markdown="1">
**Security Note:** Keep your authentication token private. Don't commit it and don't share it, treat it like a password.
</div>


## Testing

Let's write a first visual snapshot test! We will just render some static HTML / CSS content for now.

Start by creating a test project and installing the basic dependencies:

```bash
$ mkdir shutter-test
$ cd shutter-test

$ echo "{}" > package.json
$ npm install @shutter/core
```

Let's create a simple script file `button.js` to render a simple button:

```js
// button.js

const createShutter = require('@shutter/core').default

const shutter = createShutter(__dirname)

const main = async () => {
  const html = `
    <button class="btn">Click here!</button>
    <style>
      button.btn {
        padding: 0 40px;
        height: 38.4px;
        line-height: 38.4px;
        background: #00A1CB;
        border: none;
        border-radius: 3px;
        color: #FFFFFF;
        cursor: pointer;
        font-family: "Helvetica Neue Light","Helvetica Neue",Arial,sans-serif;
        font-size: 18px;
        font-weight: 300;
        text-decoration: none;
      }
    </style>
  `

  await shutter.snapshot('Button', html)
  await shutter.finish()
}

main().catch(error => {
  console.error(error)
})
```

We can now run our little script to render the button.

```bash
$ node button.js
```

The output should look similar to that:

```
Shutter ran 1 tests ✔
Inspect the snapshots at <https://shutter.sh/snapshot-set/KyCa50DaCBqI>
```

Follow the link in the console output to inspect the rendered button in your browser. Also note that a file `snapshots/button.png` has just been created. It is a local copy of the rendered button snapshot that will be used for future regression testing.

Congratulations, you are now up and running!
