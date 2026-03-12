import express from 'express';
import { getAllBookings } from '../controllers/schedule.controller.js';

const router = express.Router();

// GET /api/admin/bookings
router.get('/bookings', getAllBookings);

export default router;