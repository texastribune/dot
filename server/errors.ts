/* eslint-disable max-classes-per-file */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any };

export interface EnhancedError extends Error {
  status?: number;
}

export abstract class AppError extends Error implements EnhancedError {
  public status: number;

  public extra?: AnyObject;

  constructor({
    message,
    name,
    status,
    extra = {},
  }: {
    message: string;
    name: string;
    status: number;
    extra?: AnyObject;
  }) {
    super(message);

    this.name = name;
    this.status = status;
    this.extra = extra;
  }
}

export class UnauthorizedError extends AppError {
  constructor({ message, extra }: { message: string; extra?: AnyObject }) {
    super({ message, extra, status: 401, name: 'UnauthorizedError' });
  }
}

export class TokenRetrievalError extends AppError {
  constructor({
    message,
    status = 500,
    extra,
  }: {
    message: string;
    status?: number;
    extra?: AnyObject;
  }) {
    super({ message, status, extra, name: 'TokenRetrievalError' });
  }
}

export class PublicKeyError extends AppError {
  constructor({
    message,
    status,
    extra,
  }: {
    message: string;
    status: number;
    extra?: AnyObject;
  }) {
    super({ message, status, extra, name: 'PublicKeyError' });
  }
}
