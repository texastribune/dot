declare module 'connect-slashes' {
  import express from 'express';

  function connectSlashes(): express.RequestHandler;

  export = connectSlashes;
}

declare module 'uuid' {
  // eslint-disable-next-line import/prefer-default-export
  export function v4(): string;
}
