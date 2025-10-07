import express from 'express';
import { findRiders, createPickupRequest } from '../controllers/pickupController';

const router = express.Router();

// Find nearest available riders
router.post('/find-riders', findRiders);

// Create pickup request
router.post('/create', createPickupRequest);

export default router;
