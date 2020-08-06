const schema = `
scalar DateTime


interface ViewsItem {
  views: Int!
}

type ViewsItemByCanonical implements ViewsItem {
  views: Int!
  canonical: String!
}

type ViewsItemByDomain implements ViewsItem {
  views: Int!
  domain: String
}


type ViewsList {
  items: [ViewsItem!]!
  totalViews: Int!
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
}
`;

export default schema;
