/* eslint-disable */

// (
//   error: EnhancedError,
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   res.status(404).send();
// }

export default function staticFileError(responseHeaders?: any) {
  // @ts-ignore
  return (error, req, res, next): void => {
    if (responseHeaders) {
      res.set(responseHeaders);
    }
    res.status(404).send();
  };
}
