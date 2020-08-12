import express from 'express';

import { EnhancedError } from '../errors';

export default function staticFileError(responseHeaders?: {
  [key: string]: string;
}) {
  return (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ): void => {
    if (responseHeaders) {
      res.set(responseHeaders);
    }
    res.status(404).send();
  };
}
