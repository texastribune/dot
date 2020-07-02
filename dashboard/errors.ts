import { AppError } from '../server/errors';

// eslint-disable-next-line import/prefer-default-export
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
