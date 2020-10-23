module.exports = {

  /**
   * Set manually. Find configuration in
   * studio/sanity.json or on manage.sanity.io
   */
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID || '4bxid9r9',
    dataset: process.env.SANITY_DATASET || 'production',
    useCdn: process.env.NODE_ENV === 'development',
    token: process.env.SANITY_READ_TOKEN
  }
}
