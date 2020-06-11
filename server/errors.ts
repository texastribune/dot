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

interface ResponseErrorExtra<T> {
  gotResponse: boolean;
  code?: string;
  data?: T;
}
export class ResponseError<T> extends AppError<ResponseErrorExtra<T>> {
  constructor({
    message,
    extra,
    status = 500,
  }: {
    message: string;
    extra: ResponseErrorExtra<T>;
    status?: number;
  }) {
    super({ message, status, extra, name: 'AxiosResponseError' });
  }
}

export class RequestError extends AppError {
  constructor({ message }: { message: string }) {
    super({ message, status: 500, name: 'AxiosRequestError' });
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
