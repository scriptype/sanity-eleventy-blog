const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../utils/sanityClient.js')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generatePost (post) {
  return {
    ...post,
    excerpt: BlocksToMarkdown(post.excerpt, { serializers, ...client.config() }),
    body: BlocksToMarkdown(post.body, { serializers, ...client.config() }),
    authors: (post.authors || []).map(author => ({
      ...author,
      bio: BlocksToMarkdown(author.bio, { serializers, ...client.config() })
    })),
    date: new Date(post.publishedAt)
  }
}

async function getPosts () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const query = groq`*[_type == "static" && defined(slug) && publishedAt < now()] | order(publishedAt desc) {
    _id,
    _createdAt,
    publishedAt,
    title,
    slug,
    excerpt,
    body[]{
      ...,
      children[]{
        ...,
        // Join inline reference
        _type == "authorReference" => {
          // check /studio/documents/authors.js for more fields
          "name": @.author->name,
          "slug": @.author->slug
        }
      }
    },
    mainImage{
      caption,
      alt,
      "url": asset->url
    },
    "categories": categories[]->{
      title,
      description
    },
    "authors": authors[].author->{
      bio,
      name,
      "slug": slug.current,
      image{
        alt,
        "url": asset->url
      }
    }
  }`
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const preparePosts = reducedDocs.map(generatePost)
  return preparePosts
}

module.exports = getPosts
