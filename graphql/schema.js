const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = `
  type ArticleByViews {
    canonical: String!,
    views: Float!
  }

  type ReprinterByReprints {
    domain: String!,
    reprints: Float!
  }

  type Summary {
    topArticles(
      startDate: String!,
      endDate: String!
    ): [ArticleByViews]!,
    topReprinters(
      startDate: String!,
      endDate: String!
    ): [ReprinterByReprints]!
  }


  type ReprinterByArticleViews {
    domain: String!,
    views: Float!
  }

  type ArticleDetail {
    canonical: String!,
    totalViews: Float!,
    allReprinters(
      canonical: String!,
      startDate: String!,
      endDate: String!
    ): [ReprinterByArticleViews]!
  }


  type ArticleByReprinterViews {
    canonical: String!,
    views: Float!
  }

  type ReprinterDetail {
    domain: String!,
    totalReprints: Float!,
    allArticles(
      domain: String!,
      startDate: String!,
      endDate: String!
    ): [ArticleByReprinterViews]!
  }


  type Query {
    summary: Summary!

    articleDetail(
      canonical: String!,
      startDate: String!,
      endDate: String!
    ): ArticleDetail!,

    reprinterDetail(
      domain: String!,
      startDate: String!,
      endDate: String!
    ): ReprinterDetail!
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
