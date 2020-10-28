/* eslint-disable max-classes-per-file */

import { AppError } from '../shared-errors';

export class NotAllowedError extends AppError {
  constructor() {
    super({
      message: 'You do not have sufficient permissions to view this route',
      name: 'NotAllowedError',
    });
  }
}

export class InvalidDatesError extends AppError {
  constructor(message: string) {
    super({
      message,
      name: 'InvalidDatesError',
    });
  }
}
