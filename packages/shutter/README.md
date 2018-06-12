# shutter

CLI tool to use the [shutter.sh](https://shutter.sh/) service.

It can upload static web pages to the service for processing and download files from it.

## Installation

```sh
$ npm install shutter
# or using yarn:
$ yarn add shutter
```

## Usage

### Login

You need an authentication token in order to use shutter.sh. The `shutter` CLI tool allows you to easily log in using your token.

```sh
$ npx shutter authenticate YOURAUTHTOKEN
```

### Update snapshots

From time to time you will work on your user interface and the snapshots won't match anymore, due to intended changes. In that case you can use `shutter update` to interactively update your snapshots.

```sh
$ shutter update
```

It shows an interactive list containing all tests that failed on last test run. You can select the snapshots you want to update.

### Help

To print usage instructions:

```sh
$ npx shutter --help
```

## See also

Check out the documentation page at <https://shuttersh.github.io/shutter/>.
