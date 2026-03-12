import {Booking} from '../models/schedule.model.js';
import { sendBookingEmail } from './emailService.js';

export const saveBooking = async (bookingData) => {
  // 1. Check for double-booking
  const existingBooking = await Booking.findOne({ 
    slotStartTime: bookingData.slotStartTime 
  });

  if (existingBooking) {
    const error = new Error("This time slot has already been booked.");
    error.status = 409;
    throw error;
  }

  // 2. Save to Database
  const newBooking = new Booking(bookingData);
  const savedBooking = await newBooking.save();

  // 3. Attempt to send email
  let emailSent = true;
  console.log(emailSent)
  try {
    await sendBookingEmail(
      { firstName: savedBooking.firstName, email: savedBooking.email }, 
      savedBooking
    );
  } catch (err) {
    // Change this to log the FULL error object
    console.log("CRITICAL EMAIL ERROR:", err); 
    emailSent = false; 
  }

  // Return both the data and the email status
  return { savedBooking, emailSent };
};  