// Date utility functions

export function isToday(date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function format(date, pattern) {
  if (pattern === 'MMM d') {
    return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
  }
  if (pattern === 'MMMM yyyy') {
    return `${MONTH_LONG[date.getMonth()]} ${date.getFullYear()}`;
  }
  return date.toLocaleDateString();
}

export function formatDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return `${DAY_LONG[d.getDay()]}, ${MONTH_LONG[d.getMonth()]} ${d.getDate()}`;
}

export function groupEventsByDate(events) {
  const groups = {};
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  for (const ev of sorted) {
    if (!groups[ev.date]) groups[ev.date] = [];
    groups[ev.date].push(ev);
  }
  return groups;
}
