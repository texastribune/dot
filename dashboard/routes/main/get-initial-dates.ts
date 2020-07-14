import { Route } from 'vue-router';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import addWeeks from 'date-fns/addWeeks';
import subWeeks from 'date-fns/subWeeks';
import startOfToday from 'date-fns/startOfToday';

import { InvalidDatesError } from '../../errors';

// return start and end dates for the date picker
// in current timezone and in ISO 8601 YYYY-MM-DD format
export default function getInitialDates(route: Route): string[] {
  const { start, end } = route.query;

  // neither query param exists
  if (!start && !end) {
    const todayObj = startOfToday();
    const todayDateString = formatISO(todayObj, {
      representation: 'date',
    });
    const twoWeeksAheadObj = addWeeks(todayObj, 2);
    const twoWeeksAheadDateString = formatISO(twoWeeksAheadObj, {
      representation: 'date',
    });

    return [todayDateString, twoWeeksAheadDateString];
  }

  // one or both query params are arrays
  if (Array.isArray(start) || Array.isArray(end)) {
    throw new InvalidDatesError({
      message: 'Invalid start and end date in URL',
    });
  }

  // the start query param exists as a string
  if (start && !end) {
    // the start query param is not a valid ISO 8601 string
    if (parseISO(start).toString() === 'Invalid Date') {
      throw new InvalidDatesError({
        message: 'The start date is invalid',
      });
    }

    const startObj = parseISO(start);
    const startDateString = formatISO(startObj, {
      representation: 'date',
    });
    const twoWeeksAheadObj = addWeeks(startObj, 2);
    const twoWeeksAheadDateString = formatISO(twoWeeksAheadObj, {
      representation: 'date',
    });

    return [startDateString, twoWeeksAheadDateString];
  }

  // the end query param exists as a string
  if (end && !start) {
    // the end query param is not a valid ISO 8601 string
    if (parseISO(end).toString() === 'Invalid Date') {
      throw new InvalidDatesError({
        message: 'The end date is invalid',
      });
    }

    const endObj = parseISO(end);
    const endDateString = formatISO(endObj, {
      representation: 'date',
    });
    const twoWeeksBeforeObj = subWeeks(endObj, 2);
    const twoWeeksBeforeDateString = formatISO(twoWeeksBeforeObj, {
      representation: 'date',
    });

    return [twoWeeksBeforeDateString, endDateString];
  }

  // start start query param is greater than or equal to the end one
  if (start >= end) {
    throw new InvalidDatesError({
      message: "The start date can't be greater than or equal to the end date",
    });
  }

  return [start, end];
}
