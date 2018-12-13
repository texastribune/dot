import gql from 'graphql-tag';

export default gql`
  query ReprinterDetailQuery(
    $startDate: String!,
    $endDate: String!,
    $domain: String!
  ) {
    reprinterDetail(
      startDate: $startDate,
      endDate: $endDate,
      domain: $domain,
    ) {
      domain,
      totalReprints,
      allArticles(
        startDate: $startDate,
        endDate: $endDate,
        domain: $domain,
      ) {
        canonical,
        views
      }
    }
  }
`;
