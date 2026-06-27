export const getRelativeDateString = (offsetMinutes) => {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getRelativeTimeString = (offsetMinutes) => {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const formatDisplayDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const parsedDate = new Date(`${dateStr}T${timeStr}`);
  if (!isNaN(parsedDate.getTime())) {
    return `${parsedDate.toLocaleDateString('en-US', options)}, ${timeStr}`;
  }
  return `${dateStr}, ${timeStr}`;
};

export const getEventStatus = (evt) => {
  if (!evt.date || !evt.clockTime) return 'Upcoming';
  
  const [year, month, day] = evt.date.split('-').map(Number);
  const [hours, minutes] = evt.clockTime.split(':').map(Number);
  const eventStart = new Date(year, month - 1, day, hours, minutes);
  
  const now = new Date();
  const sessionDurationMs = 60 * 60 * 1000; // 1 Hour window
  const eventEnd = new Date(eventStart.getTime() + sessionDurationMs);

  if (now < eventStart) {
    return 'Upcoming';
  } else if (now >= eventStart && now <= eventEnd) {
    return 'Active';
  } else {
    return 'Completed';
  }
};