const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItTOC = require('markdown-it-table-of-contents')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')

const headerSlugify = (text) => {
  const cleaned = text.replace(/<\/?code>/g, '').replace(/(&lt;|&gt;|[<>])/g, '')
  return markdownItAnchor.defaults.slugify(cleaned)
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlightPlugin)
  eleventyConfig.addPassthroughCopy('site/favicon')
  eleventyConfig.addPassthroughCopy('site/images')
  eleventyConfig.addPassthroughCopy('site/styles')

  const markdownEngine = markdownIt({ html: true })

  markdownEngine.use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#',
    slugify: headerSlugify
  })
  markdownEngine.use(markdownItTOC, {
    includeLevel: [2],
    containerHeaderHtml: '<h2>Table of Contents</h2>',
    slugify: headerSlugify
  })

  eleventyConfig.setLibrary('md', markdownEngine)

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
