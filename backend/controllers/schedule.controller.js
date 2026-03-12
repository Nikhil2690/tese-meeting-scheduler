import * as bookingService from '../services/schedule.service.js';
import { generateWorkdaySlots } from '../utils/timeSlots.js';
import { availabilityQuerySchema } from '../middleware/validate.js';
import {Booking} from '../models/schedule.model.js';


export const createBooking = async (req, res) => {
  try {
    const { savedBooking, emailSent } = await bookingService.saveBooking(req.body);

    res.status(201).json({
      success: true,
      message: emailSent 
        ? "Booking confirmed and email sent!" 
        : "Booking confirmed, but we couldn't send the confirmation email.",
      emailWarning: !emailSent,
      data: savedBooking
    });

  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};


export const getAvailability = (req, res) => {
  try {
    // 1. Validate query parameters
    const validatedQuery = availabilityQuerySchema.parse(req.query);
    console.log(validatedQuery)
    const { date, timezone } = validatedQuery;

    // 2. Convert string to Date object
    const parsedDate = new Date(date);
    
    // Check for "Invalid Date" object
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date provided" });
    }

    // 3. Generate slots using your utility
    const availableSlots = generateWorkdaySlots(parsedDate, timezone);

    res.status(200).json({
      success: true,
      count: availableSlots.length,
      data: availableSlots
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        success: false, 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ success: false, message: "Server error calculating availability" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .select('firstName surname email startTime timeZone') // Use your actual schema fields
      .sort({ startTime: 1 });

    // Transform the data before sending it to the UI
    const transformedBookings = bookings.map(booking => {
      const start = new Date(booking.startTime);
      
      return {
        _id: booking._id,
        firstName: booking.firstName,
        surname: booking.surname,
        email: booking.email,
        // Manually extract date and time strings from the Date object
        date: start.toISOString().split('T')[0], // Result: "2026-03-11"
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Result: "16:30"
        timezone: booking.timeZone, // Map timeZone (Schema) to timezone (UI)
      };
    });

    res.status(200).json({
      success: true,
      count: transformedBookings.length,
      data: transformedBookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
      error: error.message
    });
  }
};