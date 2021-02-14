const string = require("string");
const util = require('util')
const { DateTime } = require("luxon");
const cssmin = require("cssmin");

module.exports = function(eleventyConfig) {

  // https://www.11ty.io/docs/quicktips/inline-css/
  eleventyConfig.addFilter("cssmin", function(code) {
    return cssmin(code)
  });

  eleventyConfig.addFilter("debug", function(value) {
    return util.inspect(value, {compact: false})
   });

   eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toDateString()
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('slugify', input => {
    if (!input) { return false };
    return string(input).slugify().toString();
  });

  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  eleventyConfig.addFilter("markdownify", function(value) {
    const md = new markdownIt(options)
    return md.render(value)
  })

  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value)
  })

  const postHasCategory = (post, categoryTitle) => {
    return !!(post.categories || []).find(category => category.title === categoryTitle)
  }

  eleventyConfig.addNunjucksFilter("category", function(items, categoryTitle) {
    return items.filter(item => {
      return item.data && item.data.post && postHasCategory(item.data.post, categoryTitle)
    })
  })

  eleventyConfig.addNunjucksFilter("excludeCategory", function(items, categoryTitle) {
    return items.filter(item => !postHasCategory(item.data.post, categoryTitle))
  })

  eleventyConfig.addNunjucksFilter("head", function(posts, number) {
    return posts.slice(0, number)
  })

  eleventyConfig.addNunjucksFilter("nicePageUrl", function(url) {
    return url.replace(/index.html$/, "")
  })

  eleventyConfig.addCollection("post", function(collectionApi) {
    const posts = collectionApi.getFilteredByTag("post")
    return posts.sort((a, b) => b.data.post.date - a.data.post.date)
  });

  const fixedNavigation = [
    '/', // home
    '/about-me/',
    '/archive/'
  ]

  const findLatestPostInCategory = (categoryTitle, posts) => {
    const categoryPosts = posts.filter(post => {
      return post.categories && post.categories.some(cat => cat.title === categoryTitle)
    })
    return categoryPosts[0]
  }

  eleventyConfig.addCollection("nav", function(collectionApi) {
    const navItems = collectionApi.getFilteredByTag("nav")
    const fixedItems = fixedNavigation.map(url => {
      return navItems.find(item => item.url === url)
    })

    const categoryItems = navItems.filter(item => !!item.data.category)

    const categoryItemsWithLatestPosts = []
    categoryItems.forEach(item => {
      item.latestPost = findLatestPostInCategory(item.data.category.title, item.data.posts)
      if (item.latestPost) {
        categoryItemsWithLatestPosts.push(item)
      }
    })

    const categoriesSorted = categoryItemsWithLatestPosts.sort((itemA, itemB) => {
      return itemB.latestPost.date - itemA.latestPost.date
    })

    return [
      ...fixedItems,
      ...categoriesSorted
    ]
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}
