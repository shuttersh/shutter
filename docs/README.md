# docs.shutter.sh

This are the sources of [docs.shutter.sh](https://docs.shutter.sh/). It is the documentation of the `shutter.sh` service,
implemented as a static site. It uses the [eleventy](https://11ty.io/) static site generator.


## Development

First, install the dependencies, as usual:

```sh
npm install
# or
yarn install
```

Now you can start working on the docs:

```sh
# Start a development server that serves the site and reloads it on file change
npm run dev
```

To statically build the site for deployment (you will usually not need to do that manually):

```sh
npm run build
```


## Files and Directories

Find all the site's source files in [`docs/site`](https://github.com/shuttersh/shutter/tree/master/docs/site). The page contents
can be found in the markdown files.

Create a new markdown file to get a new page. The directory you place it in and the filename
will determine the path of the resulting HTML page.


## Deployment

Create a pull request. The repository is linked to [netlify](https://netlify.com/), which will automatically deploy the updated site
to [docs.shutter.sh](https://docs.shutter.sh/) when the pull request is merged into the `master` branch.

It will also create a preview deployment when you open the pull request. Easy as cake! 🍰
