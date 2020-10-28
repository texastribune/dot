/* eslint-disable max-classes-per-file */

export interface EnhancedError extends Error {
  status?: number;
}

export class NetworkError extends Error implements EnhancedError {
  public code?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data?: any;

  public status?: number;

  constructor({
    message,
    code,
    data,
    status,
  }: {
    message: string;
    code?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
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

export abstract class AppError extends Error implements EnhancedError {
  public status?: number;

  constructor({
    message,
    name,
    status,
  }: {
    message: string;
    name: string;
    status?: number;
  }) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super({
      message: 'Insufficient permissions',
      status: 403,
      name: 'ForbiddenError',
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super({
      message: 'Invalid authorization credentials',
      status: 401,
      name: 'UnauthorizedError',
    });
  }
}
