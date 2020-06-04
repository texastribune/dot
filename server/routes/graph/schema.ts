const schema = `
scalar Date


type ViewsGroup {
  id: ID
  canonical: String
  domain: String
  views: Int!
}

type ViewsList {
  items: [ViewsGroup!]!
  totalViews: Int!
}


type ReprinterGroup {
  id: ID
  domain: String!
  reprints: Int!
}

type TopReprinters {
  items: [ReprinterGroup!]!
}


type Query {
  viewsList(
    startDate: Date!
    endDate: Date!
    canonicalFilter: String
    domainFilter: String
    summarizeByCanonical: Boolean
    summarizeByDomain: Boolean
  ): ViewsList

  topReprinters: TopReprinters
}
`;

export default schema;
