// Utility functions for TimeSheet and other components
export function getCurrentMonthDates() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const dates = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push({
      date: new Date(d),
      day: d.getDay(),
      week: Math.ceil((d.getDate() + firstDay.getDay()) / 7)
    });
  }
  return dates;
}

export const holidays = [
  // Example: { date: '2024-06-15', name: 'Some Holiday' }
];

export function isSunday(date) {
  return date.getDay() === 0;
}

export const workDescriptionTemplate = {
  startTime: '',
  endTime: '',
  description: ''
};

// Optionally, keep the Lists component for future use
const Lists = () => null;
export default Lists;