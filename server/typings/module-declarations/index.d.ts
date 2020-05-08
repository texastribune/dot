declare module 'connect-slashes' {
  import express from 'express';

  function connectSlashes(): express.RequestHandler;

  export = connectSlashes;
}
