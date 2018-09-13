# Shutter.sh Client Packages [![Build Status](https://travis-ci.org/shuttersh/shutter.svg?branch=master)](https://travis-ci.org/shuttersh/shutter)

This monorepo contains the client packages you need to work with the [shutter.sh](https://shutter.sh/) visual snapshotting service.

* [**Homepage**](https://shutter.sh/)<br />
* [**Documentation**](https://docs.shutter.sh)<br />
* [**Dashboard**](https://shutter.sh/dashboard)


## Documentation

Find the documentation at <https://docs.shutter.sh>. It contains user-centric documentation and the *Getting Started* guide.

The sources of the documentation website can be found in [./docs](./docs). Open an issue or a pull request to propose changes to the documentation.


## End user packages

### [@shutter/react](./packages/react/README.md)

The React component snapshotting package. Use it to write visual regression tests for your React UI.

### [@shutter/vue](./packages/vue/README.md)

The Vue component snapshotting package. Use it to write visual regression tests for your Vue.js UI.

### [@shutter/core](./packages/core/README.md)

The bare framework-agnostic HTML snapshotting package. It is the base of `@shutter/react` and potential future framework-specific packages.

### [shutter](./packages/shutter/README.md)

The command line tool. Use it to log in to your account in the terminal. Allows updating the local snapshots easily when your components change.


## License

MIT
