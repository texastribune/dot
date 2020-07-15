const schema = `
scalar DateTime


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
    startDate: DateTime!
    endDate: DateTime!
  ): ViewsList!

  viewsListByCanonical(
    domain: String
    startDate: DateTime!
    endDate: DateTime!
  ): ViewsList!


  topReprinters: [ReprinterItem!]!
}
`;

export default schema;
