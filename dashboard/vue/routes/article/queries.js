import gql from 'graphql-tag';

export default gql`
  query ArticleDetailQuery(
    $startDate: String!,
    $endDate: String!,
    $canonical: String!
  ) {
    articleDetail(
      startDate: $startDate,
      endDate: $endDate,
      canonical: $canonical,
    ) {
      canonical,
      totalViews,
      allReprinters(
        startDate: $startDate,
        endDate: $endDate,
        canonical: $canonical,
      ) {
        domain,
        views
      }
    }
  }
`;
