/* eslint-disable */

const resolvers = {
  Query: {
    posts(root: any, args: any, request: any): string[] {
      if (request.user.permissions.includes('dot:view_data')) {
        console.log('you are allowed here :)');
      } else {
        console.log('you are NOT allowed here :(');
      }

      return ['foo', 'bar'];
    },
  },
};

export default resolvers;
