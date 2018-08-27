const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlightPlugin)
  eleventyConfig.addPassthroughCopy('site/favicon')
  eleventyConfig.addPassthroughCopy('site/images')
  eleventyConfig.addPassthroughCopy('site/styles')

  // TODO: Customize markdown parsing
  // see <https://www.npmjs.com/package/markdown-it-table-of-contents>
  // see <https://www.npmjs.com/package/markdown-it-anchor>
  // see <https://www.11ty.io/docs/languages/markdown/>

  return {
    dir: {
      input: 'site',
      output: 'dist'
    },
    // templateFormats: ['css']
  }
}
