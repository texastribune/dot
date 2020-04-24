/* eslint-disable */

const resolvers = {
  Query: {
    posts(root: any, args: any, request: any): string[] {
      return ['foo', 'bar'];
    },
  },
};

export default resolvers;
