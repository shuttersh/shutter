module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('site/favicon')
  eleventyConfig.addPassthroughCopy('site/images')
  eleventyConfig.addPassthroughCopy('site/styles')

  return {
    dir: {
      input: 'site',
      output: 'dist'
    },
    // templateFormats: ['css']
  }
}
