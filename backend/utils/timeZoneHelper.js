
/**
 * Converts a UTC date to a formatted string with its timezone offset.
 * @param {Date|string} utcDate - The UTC date from the database.
 * @param {string} timezone - The IANA timezone string (e.g., 'Asia/Bangkok').
 * @returns {string} - Formatted string like "UTC+07:00"
 */
export const formatTimezoneOffset = (utcDate, timezone) => {
  const date = new Date(utcDate);

  // 1. Get the offset in minutes for the specific timezone
  // We use Intl to get the parts of the date in that timezone
  const parts = Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset'
  }).formatToParts(date);

  // 2. Extract the offset string (e.g., "GMT+7")
  const offsetPart = parts.find(p => p.type === 'timeZoneName').value;

  // 3. Clean up the string to match your requested format 'UTC+/-HH:mm'
  // Most engines return "GMT+X" or "GMT-X:XX"
  let formattedOffset = offsetPart.replace('GMT', 'UTC');

  // Ensure double digits and colon (e.g., UTC+7 -> UTC+07:00)
  if (!formattedOffset.includes(':')) {
    const match = formattedOffset.match(/([+-])(\d+)/);
    if (match) {
      const sign = match[1];
      const hours = match[2].padStart(2, '0');
      formattedOffset = `UTC${sign}${hours}:00`;
    }
  }

  return formattedOffset;
};

/**
 * Full formatter for the confirmation email
 * Returns: "Monday, 9 March 2026 at 16:30 (UTC+07:00)"
 */
export const getEmailTimestamp = (utcDate, timezone) => {
  const date = new Date(utcDate);
  
  const timeString = date.toLocaleTimeString('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const dateString = date.toLocaleDateString('en-GB', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const offset = formatTimezoneOffset(date, timezone);

  return `${dateString} at ${timeString} (${offset})`;
};