---
title: Home
---

<div class="jumbotron">
  <h1>Shutter packages</h1>
  <p class="lead">
    This is the documentation of the <a href="https://shutter.sh">shutter.sh</a> client packages.<br />
    Write visual user interface tests or render arbitrary web content.
  </p>
  <p class="lead">
    <a class="btn btn-primary btn-lg" href="./getting-started" role="button">Getting started</a>
  </p>
</div>


# What is Shutter?

[Shutter](https://shutter.sh/) is a service for rendering visual web content snapshots and comparing snapshots.

Use it to write user interface regression tests. You can also use it to easily render HTML, CSS, JavaScript content without a local browser.


# Getting Started

Read the [Getting Started](./getting-started) guide.

It covers:
* Setup
* Writing React Tests
* Updating Snapshots


# Beyond Testing

With shutter you cannot only write visual component tests. You can also snapshot-test whole pages or render arbitrary web content.

That usage is currently beyond the scope of this document, though. Browse the package readme files if you are interested:

* [`@shutter/core` package](https://github.com/shuttersh/shutter/tree/master/packages/core) - for testing static web content
* [`@shutter/api` package](https://github.com/shuttersh/shutter/tree/master/packages/api) - for querying the shutter service manually


# Angular, Vue & others

Support for those frameworks is not implemented right now, should be fairly straight forward to do, though.

If you need support for an additional framework urgently, feel free to write a package and open a pull request. Contributions are always welcome.


# See Also

- [Repository on GitHub](https://github.com/shuttersh/shutter)
- [Shutter.sh homepage](https://shutter.sh/)
- [Shutter on Twitter](https://twitter.com/shuttersh)
