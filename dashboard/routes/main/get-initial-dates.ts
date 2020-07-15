import { Route } from 'vue-router';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import addWeeks from 'date-fns/addWeeks';
import startOfToday from 'date-fns/startOfToday';

import { InvalidDatesError } from '../../errors';

interface DatePickerValues {
  startDate: string;
  endDate: string;
  error?: InvalidDatesError<undefined>;
}

// return start and end dates for the date picker in ISO 8601 YYYY-MM-DD format
export default function getInitialDates(route: Route): DatePickerValues {
  const { startDate: startDateQuery, endDate: endDateQuery } = route.query;
  const todayObj = startOfToday();
  const todayDateString = formatISO(todayObj, {
    representation: 'date',
  });
  const twoWeeksAheadObj = addWeeks(todayObj, 2);
  const twoWeeksAheadDateString = formatISO(twoWeeksAheadObj, {
    representation: 'date',
  });
  const startIso = `${startDateQuery}T00:00:00`;
  const endIso = `${endDateQuery}T00:00:00`;
  const errorFallback = {
    startDate: todayDateString,
    endDate: twoWeeksAheadDateString,
  };

  // one or both query params are arrays
  if (Array.isArray(startDateQuery) || Array.isArray(endDateQuery)) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message: 'Invalid start and end date in URL',
      }),
    };
  }

  // either start or end is supplied, but not both
  if ((startDateQuery && !endDateQuery) || (endDateQuery && !startDateQuery)) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message: 'You must supply both start date and end date',
      }),
    };
  }

  // the query-param dates are not properly ISO 8601 formatted
  if (
    parseISO(startDateQuery).toString() === 'Invalid Date' ||
    parseISO(endDateQuery).toString() === 'Invalid Date'
  ) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message: 'The provided dates are not valid ISO 8601',
      }),
    };
  }

  // start date is greater than or equal to the end one
  if (startIso >= endIso) {
    return {
      ...errorFallback,
      error: new InvalidDatesError({
        message:
          "The start date can't be greater than or equal to the end date",
      }),
    };
  }

  return { startDate: startDateQuery, endDate: endDateQuery };
}
