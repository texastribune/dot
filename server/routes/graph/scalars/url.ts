/*  eslint-disable @typescript-eslint/no-explicit-any */

import { GraphQLScalarType } from 'graphql';
import isURL from 'validator/lib/isURL';

export default new GraphQLScalarType({
  name: 'Url',
  description: 'Type enforcing a valid URL',
  parseValue(value: any): string {
    if (typeof value !== 'string') {
      throw new TypeError(
        `URL cannot represent non-string type ${JSON.stringify(value)}`
      );
    }
    if (!isURL(value)) {
      throw new TypeError(
        `URL cannot represent invalidly formatted URL string ${JSON.stringify(
          value
        )}`
      );
    }
    return value;
  },
  parseLiteral(ast): string {
    if (ast.kind !== 'StringValue') {
      throw new TypeError(`URL cannot correspond to AST type ${ast.kind}`);
    }
    if (!isURL(ast.value)) {
      throw new TypeError(
        `URL cannot represent invalidly formatted URL string ${JSON.stringify(
          ast.value
        )}`
      );
    }
    return ast.value;
  },
  serialize(value: any): string {
    if (typeof value !== 'string') {
      throw new TypeError(
        `URL cannot represent non-string type ${JSON.stringify(value)}`
      );
    }
    if (!isURL(value)) {
      throw new TypeError(
        `URL cannot represent invalidly formatted URL string ${JSON.stringify(
          value
        )}`
      );
    }
    return value;
  },
});
