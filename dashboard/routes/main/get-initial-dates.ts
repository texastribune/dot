import moment from 'moment';

import { Route } from 'vue-router';

import { InvalidDatesError } from '../../errors';

interface DatePickerValues {
  startDate: string;
  endDate: string;
  error?: InvalidDatesError<undefined>;
}

// return start and end dates for the date picker in ISO 8601 YYYY-MM-DD format
export default function getInitialDates(route: Route): DatePickerValues {
  const { startDate: startDateQuery, endDate: endDateQuery } = route.query;

  const startIso = `${startDateQuery}T00:00:00`;
  const endIso = `${endDateQuery}T00:00:00`;

  const todayObj = moment().startOf('day');
  const todayDateString = moment(todayObj).format('YYYY-MM-DD');

  const twoWeeksAheadObj = moment(todayObj).add(2, 'weeks');
  const twoWeeksAheadDateString = moment(twoWeeksAheadObj).format('YYYY-MM-DD');

  const errorFallback = {
    startDate: todayDateString,
    endDate: twoWeeksAheadDateString,
  };

  if (
    !moment(startIso).isValid() ||
    !moment(endIso).isValid() ||
    Array.isArray(startDateQuery) ||
    Array.isArray(endDateQuery)
  ) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message: 'The provided startDate and/or endDate is not valid',
      }),
    };
  }

  if (startIso >= endIso) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message: "The startDate can't be greater than or equal to the endDate",
      }),
    };
  }

  if ((startDateQuery && !endDateQuery) || (!startDateQuery && endDateQuery)) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message: 'You must provie both startDate and endDate',
      }),
    };
  }

  return {
    startDate: startDateQuery,
    endDate: endDateQuery,
  };
}
