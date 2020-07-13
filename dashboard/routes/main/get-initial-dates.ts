import { Route } from 'vue-router';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';
import addWeeks from 'date-fns/addWeeks';
import subWeeks from 'date-fns/subWeeks';
import startOfToday from 'date-fns/startOfToday';

export default function getInitialDates(route: Route): string[] {
  const { startDate, endDate } = route.query;

  if (!startDate && !endDate) {
    const todayStart = startOfToday();
    const twoWeeksAhead = addWeeks(todayStart, 2);
    const todayISO = formatISO(todayStart, {
      representation: 'date',
    });
    const twoWeeksAheadISO = formatISO(twoWeeksAhead, {
      representation: 'date',
    });
    return [todayISO, twoWeeksAheadISO];
  }

  if (startDate && !endDate) {
    const twoWeeksAhead = addWeeks(parseISO(startDate as string), 2);
    const twoWeeksAheadISO = formatISO(twoWeeksAhead, {
      representation: 'date',
    });
    return [startDate as string, twoWeeksAheadISO];
  }

  if (endDate && !startDate) {
    const twoWeeksBefore = subWeeks(parseISO(endDate as string), 2);
    const twoWeeksBeforeISO = formatISO(twoWeeksBefore, {
      representation: 'date',
    });
    return [twoWeeksBeforeISO, endDate as string];
  }

  return [startDate as string, endDate as string];
}
