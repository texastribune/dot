const schema = `
scalar Date


type ViewsItem {
  canonical: String
  domain: String
  views: Int!
}

type ViewsList {
  items: [ViewsItem!]!
  totalViews: Int!
}


type ReprinterItem {
  domain: String!
  reprints: Int!
}


type Query {
  viewsListByDomain(
    canonical: String
    startDate: Date!
    endDate: Date!
  ): ViewsList!

  viewsListByCanonical(
    domain: String
    startDate: Date!
    endDate: Date!
  ): ViewsList!


  topReprinters: [ReprinterItem!]!
}
`;

export default schema;
