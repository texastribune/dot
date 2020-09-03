/* eslint-disable max-classes-per-file */

export abstract class AppError extends Error {
  // eslint-disable-next-line no-useless-constructor
  constructor(message: string) {
    super(message);
  }
}

export class NotAllowedError extends AppError {
  constructor() {
    super('You do not have sufficient permissions to view this route');
    this.name = 'NotAllowedError';
  }
}

export class InvalidDatesError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDatesError';
  }
}
