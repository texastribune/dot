const schema = `
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
    startDate: String!
    endDate: String!
    canonicalFilter: String
    domainFilter: String
    summarizeByCanonical: Boolean
    summarizeByDomain: Boolean
  ): ViewsList

  topReprinters: TopReprinters
}
`;

export default schema;
