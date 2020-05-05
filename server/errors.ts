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

export class GraphError extends AppError {
  constructor({
    message,
    status,
    extra,
  }: {
    message: string;
    status: number;
    extra?: AnyObject;
  }) {
    super({ message, status, extra, name: 'GraphError' });
  }
}

export class TokenEndpointError extends AppError {
  constructor({
    message,
    status,
    extra,
  }: {
    message: string;
    status: number;
    extra?: AnyObject;
  }) {
    super({ message, status, extra, name: 'TokenEndpointError' });
  }
}

export class TrackerEndpointError extends AppError {
  constructor({
    message,
    status,
    extra,
  }: {
    message: string;
    status: number;
    extra?: AnyObject;
  }) {
    super({ message, status, extra, name: 'TrackerEndpointError' });
  }
}
