
import express from 'express';
import {Booking} from  '../models/schedule.model.js';
import  {validateBooking} from '../middleware/validate.js';
import { getAllBookings, getAvailability } from '../controllers/schedule.controller.js';

const router = express.Router();

router.post('/', validateBooking, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: "Server error saving booking", error: err.message });
  }
});

router.get('/availability', getAvailability);

router.get('/bookings', getAllBookings);

export default router;