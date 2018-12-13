import gql from 'graphql-tag';

export default gql`
  query SummaryQuery(
    $startDate: String!,
    $endDate: String!
  ) {
    summary {
      topArticles(
        startDate: $startDate,
        endDate: $endDate
      ) {
        canonical,
        views
      }

      topReprinters(
        startDate: $startDate,
        endDate: $endDate
      ) {
        domain,
        reprints
      }
    }
  }
`;
