/* eslint-disable max-classes-per-file */

import { AppError } from '../shared-errors';

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

export class TrackerCreationError extends AppError {
  constructor(message: string) {
    super({
      message,
      status: 400,
      name: 'TrackerCreationError',
    });
  }
}
