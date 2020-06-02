const schema = `
type Reprint {
  id: ID
  canonical: String!
  views: Int!
}

type Reprints {
  items: [Reprint!]!
  totalViews: Int!
}


type Query {
  reprints(
    startDate: String!
    endDate: String!
    domain: String
  ): Reprints
}
`;

export default schema;
