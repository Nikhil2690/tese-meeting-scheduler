import { 
  format, 
  addMinutes, 
  isBefore, 
  isToday, 
  isWeekend, 
  startOfDay, 
  setHours, 
  setMinutes 
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Generates 15-minute intervals for a workday (09:00 - 17:00).
 * @param {Date} date - The date selected by the user.
 * @param {string} timezone - The target timezone string (e.g., 'Asia/Kolkata').
 * @returns {string[]} - Array of time strings (HH:mm).
 */
export const generateWorkdaySlots = (date, timezone) => {
  // 1. Return empty if it's a weekend
  if (isWeekend(date)) return [];

  const slots = [];
  const now = new Date();
  
  // Convert current time to the target timezone for accurate "past slot" checking
  const nowInTargetTz = toZonedTime(now, timezone);
  
  // 2. Define Workday Boundaries (9:00 AM to 5:00 PM)
  let currentSlot = setMinutes(setHours(startOfDay(date), 9), 0);
  const endSlot = setHours(startOfDay(date), 17);

  while (isBefore(currentSlot, endSlot)) {
    // Convert current slot to target timezone to compare properly
    const slotInTargetTz = toZonedTime(currentSlot, timezone);
    
    // 3. Logic: If the date is today, filter out slots that have already passed
    const isSlotAvailable = isToday(date) 
      ? isBefore(nowInTargetTz, slotInTargetTz) 
      : true;

    if (isSlotAvailable) {
      slots.push(format(currentSlot, 'HH:mm'));
    }

    // Move to next 15-minute interval
    currentSlot = addMinutes(currentSlot, 15);
  }

  return slots;
};