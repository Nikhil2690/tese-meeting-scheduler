import { z } from 'zod';

// 1. Define the schemas
export const bookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  startTime: z.string().datetime(), 
  timeZone: z.string(),
  location: z.string().optional()
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  timezone: z.string().min(1, "Timezone is required")
});

// 2. Export the middleware functions as named exports
export const validateBooking = (req, res, next) => {
  try {
    bookingSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
  }
};