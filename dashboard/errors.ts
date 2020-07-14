/* eslint-disable max-classes-per-file */

import { AppError } from '../server/errors';

export class NotAllowedError<T> extends AppError<T> {
  constructor({ extra }: { extra?: T } = {}) {
    super({
      extra,
      message: 'You do not have sufficient permissions to view this route',
      name: 'NotAllowedError',
      status: 403,
    });
  }
}

export class InvalidDatesError<T> extends AppError<T> {
  constructor({ message, extra }: { message: string; extra?: T }) {
    super({
      extra,
      message,
      name: 'InvalidDatesError',
      status: 400,
    });
  }
}
