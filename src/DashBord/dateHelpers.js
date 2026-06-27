export const parseToISODate = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split('T')[0];
};

export const parseTo24hTime = (timeStr) => {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (match) {
    let [_, hours, minutes, am_pm] = match;
    hours = parseInt(hours);
    if (am_pm.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (am_pm.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  const d = new Date(`1970-01-01 ${timeStr}`);
  if (!isNaN(d.getTime())) {
    return d.toTimeString().split(' ')[0].slice(0, 5);
  }
  return "";
};

export const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(', ');
  if (parts.length === 2 && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) {
    const [date, time] = parts;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const parsedDate = new Date(date + "T00:00:00");
    if (!isNaN(parsedDate.getTime())) {
      return `${parsedDate.toLocaleDateString('en-US', options)}, ${time}`;
    }
  }
  return timeStr;
};