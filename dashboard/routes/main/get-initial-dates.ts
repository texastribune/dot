import moment from 'moment';

import { Route } from 'vue-router';

import { InvalidDatesError } from '../../errors';

interface DatePickerValues {
  startDate: string;
  endDate: string;
  defaultStartDate: string;
  defaultEndDate: string;
  error?: InvalidDatesError<undefined>;
}

const todayObj = moment().startOf('day');
const todayDateString = moment(todayObj).format('YYYY-MM-DD');
const twoWeeksAheadObj = moment(todayObj).add(2, 'weeks');
const twoWeeksAheadDateString = moment(twoWeeksAheadObj).format('YYYY-MM-DD');
const fallback = {
  defaultStartDate: todayDateString,
  defaultEndDate: twoWeeksAheadDateString,
  startDate: todayDateString,
  endDate: twoWeeksAheadDateString,
};

export default function getInitialDates(route: Route): DatePickerValues {
  const { startDate, endDate } = route.query;
  const startIso = `${startDate}T00:00:00`;
  const endIso = `${endDate}T00:00:00`;

  if (!startDate && !endDate) {
    return fallback;
  }

  if ((startDate && !endDate) || (!startDate && endDate)) {
    return {
      ...fallback,
      error: new InvalidDatesError({
        message:
          'If you provide a start date, you must also provide an end date',
      }),
    };
  }

  if (!moment(startIso).isValid() || !moment(endIso).isValid()) {
    return {
      ...fallback,
      error: new InvalidDatesError({
        message: 'The provided dates have invalid formatting',
      }),
    };
  }

  if (startIso >= endIso) {
    return {
      ...fallback,
      error: new InvalidDatesError({
        message:
          "The start date can't be greater than or equal to the end date",
      }),
    };
  }

  return {
    ...fallback,
    startDate: startDate as string,
    endDate: endDate as string,
  };
}
