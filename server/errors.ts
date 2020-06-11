/* eslint-disable max-classes-per-file */

export interface EnhancedError extends Error {
  status?: number;
}

// prettier-ignore
export abstract class AppError<T = undefined> extends Error implements EnhancedError {
  public status: number;

  public extra?: T;

  constructor({
    message,
    name,
    status,
    extra,
  }: {
    message: string;
    name: string;
    status: number;
    extra?: T;
  }) {
    super(message);
    this.name = name;
    this.status = status;
    this.extra = extra;
  }
}
export class ResponseError<T> extends Error implements EnhancedError {
  public gotResponse: boolean;

  public code?: string;

  public data?: T;

  public status: number;

  constructor({
    gotResponse,
    code,
    data,
    message,
    status = 500,
  }: {
    gotResponse: boolean;
    code?: string;
    data?: T;
    message: string;
    status?: number;
  }) {
    super(message);
    this.name = 'AxiosResponseError';
    this.code = code;
    this.data = data;
    this.gotResponse = gotResponse;
    this.status = status;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public formatExtra() {
    const { code, data, gotResponse, status } = this;
    return { code, data, gotResponse, status };
  }
}

export class SignInError<T> extends AppError<T> {
  constructor({
    message,
    status,
    extra,
  }: {
    message: string;
    status: number;
    extra?: T;
  }) {
    super({ message, status, extra, name: 'SignInError' });
  }
}

export class UnauthorizedError<T> extends AppError<T> {
  constructor({ message, extra }: { message: string; extra?: T }) {
    super({ message, status: 401, extra, name: 'UnauthorizedError' });
  }
}

export class TrackerCreationError<T> extends AppError<T> {
  constructor({ message, extra }: { message: string; extra?: T }) {
    super({ message, status: 400, extra, name: 'TrackerCreationError' });
  }
}

export class Auth0Error<T> extends AppError<T> {
  constructor({ message, extra }: { message: string; extra?: T }) {
    super({ message, status: 500, extra, name: 'Auth0Error' });
  }
}

export class RateLimitError<T> extends AppError<T> {
  constructor({
    extra,
  }: {
    extra?: T;
  } = {}) {
    super({
      message: 'Too many requests',
      status: 429,
      extra,
      name: 'RateLimitError',
    });
  }
}
