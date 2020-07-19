const { DateTime } = require("luxon");
const util = require('util')
const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

  // https://www.11ty.io/docs/quicktips/inline-css/
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
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

  eleventyConfig.addNunjucksFilter("category", function(posts, categoryTitle) {
    return posts.filter(post => {
      return !!(post.data.post.categories || []).find(category => category.title === categoryTitle)
    })
  })

  eleventyConfig.addCollection("myPosts", function(collectionApi) {
    const myPosts = collectionApi.getFilteredByTag("myPosts")
    return myPosts.sort((a, b) => b.data.post.date - a.data.post.date)
  });

  const fixedNavigation = [
    '/', // home
    '/about-me/',
    '/posts/' // archive
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

    const categoryItems = navItems.filter(item => {
      return !!item.data.category && !!findLatestPostInCategory(item.data.category.title, item.data.posts)
    })

    const categoryUpdates = categoryItems.reduce((dictionary, item) => {
      const categoryTitle = item.data.category.title
      const latestPost = findLatestPostInCategory(categoryTitle, item.data.posts)
      if (!latestPost) {
        return dictionary
      }
      return {
        ...dictionary,
        [categoryTitle]: latestPost.date
      }
    }, {})
    const categoriesSorted = categoryItems.sort((itemA, itemB) => {
      const categoryTitleA = itemA.data.category.title
      const categoryTitleB = itemB.data.category.title
      return categoryUpdates[categoryTitleB] - categoryUpdates[categoryTitleA]
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
