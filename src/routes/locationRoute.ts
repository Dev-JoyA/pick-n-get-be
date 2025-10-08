import express from 'express';
import { updateLocation, getLocation, removeLocation } from '../controllers/locationController';

const router = express.Router();

// Update rider location
router.post('/update', updateLocation);

// Get rider location
router.get('/:riderId', getLocation);

// Remove rider location (go offline)
router.delete('/:riderId', removeLocation);

export default router;
