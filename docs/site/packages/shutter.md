---
title: shutter
description: Shutter CLI package. Provides authentication and snapshot updating.
---

# Shutter CLI

Command line tool that comes with the [shutter.sh](https://shutter.sh/) service.

It provides authentication and snapshot updating. Can also upload static web pages to the service for processing and download files from it.

[[toc]]


## Installation

```bash
$ npm install shutter
# or using yarn:
$ yarn add shutter
```

## Usage

### Login

You need an authentication token in order to use shutter.sh. The `shutter` CLI tool allows you to easily log in using your token.

```bash
$ npx shutter authenticate YOURAUTHTOKEN
```

### Update snapshots

From time to time you will work on your user interface and the snapshots won't match anymore, due to intended changes. In that case you can use `shutter update` to interactively update your snapshots.

```bash
$ shutter update
```

It shows an interactive list containing all tests that failed on last test run. You can select the snapshots you want to update.

### Help

To print usage instructions:

```bash
$ npx shutter --help
```
