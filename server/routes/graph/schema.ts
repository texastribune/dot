const schema = `
scalar Url
scalar DateTime


interface ViewsItem {
  views: Int!
}

type ViewsItemByCanonical implements ViewsItem {
  views: Int!
  canonical: Url!
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
    canonical: Url
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
