declare module 'connect-slashes' {
  import express from 'express';

  function connectSlashes(): express.RequestHandler;

  export = connectSlashes;
}

declare module 'statuses' {
  function statuses(code: number): string;

  export = statuses;
}
