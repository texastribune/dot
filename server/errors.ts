/* eslint-disable max-classes-per-file */

import { AppError } from '../shared-errors';

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
