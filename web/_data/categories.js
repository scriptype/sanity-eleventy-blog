const groq = require('groq')
const client = require('../utils/sanityClient.js')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')

const hasToken = !!client.config().token

async function getCategories () {
  const filter = groq`*[_type == "category"]`
  const categories = await client.fetch(filter).catch(err => console.error(err))
  const reducedCategories = overlayDrafts(hasToken, categories)
  return reducedCategories.map(category => ({
    ...category,
    hidden: category.title === 'Hidden' || category.title === 'Highlights'
  }))
}

module.exports = getCategories
