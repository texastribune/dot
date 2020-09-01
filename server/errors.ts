/* eslint-disable max-classes-per-file */

export interface EnhancedError extends Error {
  status?: number;
}

export abstract class AppError extends Error implements EnhancedError {
  public status: number;

  constructor({
    message,
    name,
    status,
  }: {
    message: string;
    name: string;
    status: number;
  }) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class InternalServerError extends AppError {
  constructor() {
    super({
      message: 'Internal server error',
      status: 500,
      name: 'InternalServerError',
    });
  }
}

export class InvalidAuth0CodeError extends AppError {
  constructor() {
    super({
      message: 'Invalid authorization code',
      status: 401,
      name: 'InvalidAuth0CodeError',
    });
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

export class TrackerCreationError extends AppError {
  constructor(message: string) {
    super({
      message,
      status: 400,
      name: 'TrackerCreationError',
    });
  }
}
