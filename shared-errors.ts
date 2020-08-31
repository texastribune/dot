// eslint-disable-next-line import/prefer-default-export
export class NetworkError<T> extends Error {
  public code?: string;

  public data?: T;

  public status?: number;

  constructor({
    message,
    code,
    data,
    status,
  }: {
    message: string;
    code?: string;
    data?: T;
    status?: number;
  }) {
    super(message);

    this.name = 'NetworkError';
    this.code = code;
    this.data = data;
    this.status = status;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public formatForSentry() {
    const { data, code, status } = this;
    return { data, code, status };
  }
}
