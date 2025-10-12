import express from 'express';
import {
  getAgentDashboardStats,
  getActivePickups,
  getAvailableJobs,
  acceptJob,
  updateStatus,
  cancelPickupJob,
} from '../controllers/agentController.ts';

const router = express.Router();

// Agent dashboard stats
router.get('/:riderId/stats', getAgentDashboardStats);

// Get active pickups
router.get('/:riderId/pickups/active', getActivePickups);

// Get available jobs
router.get('/:riderId/pickups/available', getAvailableJobs);

// Accept a pickup job
router.post('/:riderId/pickups/:pickupId/accept', acceptJob);

// Update pickup status
router.patch('/:riderId/pickups/:pickupId/status', updateStatus);

// Cancel pickup
router.post('/:riderId/pickups/:pickupId/cancel', cancelPickupJob);

export default router;
