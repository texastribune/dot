const schema = `
scalar Date


type ViewsItem {
  id: ID!
  canonical: String
  domain: String
  views: Int!
}

type ViewsList {
  items: [ViewsItem!]!
  totalViews: Int!
}


type ReprinterItem {
  id: ID!
  domain: String!
  reprints: Int!
}


type Query {
  viewsList(
    startDate: Date!
    endDate: Date!
    canonicalFilter: String
    domainFilter: String
    summarizeByCanonical: Boolean
    summarizeByDomain: Boolean
  ): ViewsList!

  topReprinters: [ReprinterItem!]!
}
`;

export default schema;
