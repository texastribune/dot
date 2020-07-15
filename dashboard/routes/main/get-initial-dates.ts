import { Route } from 'vue-router';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import addWeeks from 'date-fns/addWeeks';
import startOfToday from 'date-fns/startOfToday';

import { InvalidDatesError } from '../../errors';

interface DatePickerValues {
  startDate: string;
  endDate: string;
}

// return start and end dates for the date picker in ISO 8601 YYYY-MM-DD format
export default function getInitialDates(route: Route): DatePickerValues {
  const { startDate: startDateQuery, endDate: endDateQuery } = route.query;

  // one or both query params are arrays
  if (Array.isArray(startDateQuery) || Array.isArray(endDateQuery)) {
    throw new InvalidDatesError({
      message: 'Invalid start and end date in URL',
    });
  }

  // either start or end is supplied, but not both
  if ((startDateQuery && !endDateQuery) || (endDateQuery && !startDateQuery)) {
    throw new InvalidDatesError({
      message:
        'If start date is supplied, end date must also be supplied (and vice versa)',
    });
  }

  const todayObj = startOfToday();
  const todayDateString = formatISO(todayObj, {
    representation: 'date',
  });
  const twoWeeksAheadObj = addWeeks(todayObj, 2);
  const twoWeeksAheadDateString = formatISO(twoWeeksAheadObj, {
    representation: 'date',
  });
  const startIso = `${startDateQuery || todayDateString}T00:00:00`;
  const endIso = `${endDateQuery || twoWeeksAheadDateString}T00:00:00`;

  // the query-param dates are not properly ISO 8601 formatted
  if (
    parseISO(startIso).toString() === 'Invalid Date' ||
    parseISO(endIso).toString() === 'Invalid Date'
  ) {
    throw new InvalidDatesError({
      message: 'The provided dates are not valid ISO 8601',
    });
  }

  // start date is greater than or equal to the end one
  if (startIso >= endIso) {
    throw new InvalidDatesError({
      message: "The start date can't be greater than or equal to the end date",
    });
  }

  return {
    startDate: startDateQuery || todayDateString,
    endDate: endDateQuery || twoWeeksAheadDateString,
  };
}
