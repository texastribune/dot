// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any };

export default class AppError extends Error {
  public status: number;

  public extra?: AnyObject;

  constructor(message: string, status: number, extra?: AnyObject) {
    super(message);

    this.status = status;

    if (extra) {
      this.extra = extra;
    }
  }
}
