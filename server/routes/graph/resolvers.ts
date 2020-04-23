/* eslint-disable */

const resolvers = {
  Query: {
    posts(root: any, args: any, request: any): string[] {
      console.log(request.user);
      return ['foo', 'bar'];
    },
  },
};

export default resolvers;
