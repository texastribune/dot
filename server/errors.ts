// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any };

export default class AppError extends Error {
  public status: number;

  public extra?: AnyObject;

  constructor({
    message,
    name,
    status = 500,
    extra = {},
  }: {
    message: string;
    name: string;
    status?: number;
    extra?: AnyObject;
  }) {
    super(message);

    this.name = name;
    this.status = status;
    this.extra = extra;
  }
}
