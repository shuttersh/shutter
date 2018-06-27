# Shutter.sh Client Packages [![Build Status](https://travis-ci.org/shuttersh/shutter.svg?branch=master)](https://travis-ci.org/shuttersh/shutter)

This monorepo contains the client packages you need to work with the [shutter.sh](https://shutter.sh/) visual snapshotting service.

[**Homepage**](https://shutter.sh/)<br />
[**Documentation**](https://shuttersh.github.io/shutter/)<br />
[**Dashboard**](https://shutter.sh/dashboard)


## Documentation

Find the documentation at <https://shuttersh.github.io/shutter/>. It contains user-centric documentation and the *Getting Started* guide.

Check out the package README files for more detailed technical documentation.


## End user packages

### [@shutter/react](./packages/react/README.md)

The React component snapshotting package. Use it to write visual regression tests for your React UI.

### [@shutter/core](./packages/core/README.md)

The bare framework-agnostic HTML snapshotting package. It is the base of `@shutter/react` and potential future framework-specific packages.

### [shutter](./packages/shutter/README.md)

The command line tool. Use it to log in to your account in the terminal. Allows updating the local snapshots easily when your components change.


## License

MIT
