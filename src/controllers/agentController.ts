import { Request, Response } from 'express';
import {
  getAgentActivePickups,
  getAvailablePickupJobs,
  acceptPickupJob,
  updatePickupStatus,
  cancelPickup,
  getAgentStats,
} from '../services/agentPickupService';
import { PickUpStatus } from '../models/pickupModel';

/**
 * Get agent dashboard stats
 * GET /api/v1/agents/:riderId/stats
 */
export const getAgentDashboardStats = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params;

    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rider ID',
      });
    }

    const stats = await getAgentStats(riderIdNum);

    return res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch agent stats';
    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};

/**
 * Get agent's active pickups
 * GET /api/v1/agents/:riderId/pickups/active
 */
export const getActivePickups = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params;

    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rider ID',
      });
    }

    const pickups = await getAgentActivePickups(riderIdNum);

    return res.status(200).json({
      status: 'success',
      message: `Found ${pickups.length} active pickup${pickups.length !== 1 ? 's' : ''}`,
      data: {
        count: pickups.length,
        pickups,
      },
    });
  } catch (error) {
    console.error('Error fetching active pickups:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active pickups';
    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};

/**
 * Get available pickup jobs
 * GET /api/v1/agents/:riderId/pickups/available
 */
export const getAvailableJobs = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params;
    const { limit } = req.query;

    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rider ID',
      });
    }

    const limitNum = limit ? parseInt(limit as string) : 10;
    const jobs = await getAvailablePickupJobs(riderIdNum, limitNum);

    return res.status(200).json({
      status: 'success',
      message: `Found ${jobs.length} available job${jobs.length !== 1 ? 's' : ''}`,
      data: {
        count: jobs.length,
        jobs,
      },
    });
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch available jobs';
    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};

/**
 * Accept a pickup job
 * POST /api/v1/agents/:riderId/pickups/:pickupId/accept
 */
export const acceptJob = async (req: Request, res: Response) => {
  try {
    const { riderId, pickupId } = req.params;

    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rider ID',
      });
    }

    if (!pickupId || pickupId.length !== 24) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pickup ID',
      });
    }

    const result = await acceptPickupJob(riderIdNum, pickupId);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to accept pickup',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Error accepting job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to accept job';
    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};

/**
 * Update pickup status
 * PATCH /api/v1/agents/:riderId/pickups/:pickupId/status
 */
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { riderId, pickupId } = req.params;
    const { status } = req.body;

    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rider ID',
      });
    }

    if (!pickupId || pickupId.length !== 24) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pickup ID',
      });
    }

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required',
      });
    }

    // Validate status enum
    const validStatuses = Object.values(PickUpStatus);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const result = await updatePickupStatus(riderIdNum, pickupId, status as PickUpStatus);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to update pickup status',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};

/**
 * Cancel a pickup
 * POST /api/v1/agents/:riderId/pickups/:pickupId/cancel
 */
export const cancelPickupJob = async (req: Request, res: Response) => {
  try {
    const { riderId, pickupId } = req.params;
    const { reason } = req.body;

    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rider ID',
      });
    }

    if (!pickupId || pickupId.length !== 24) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pickup ID',
      });
    }

    const result = await cancelPickup(riderIdNum, pickupId, reason);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'Failed to cancel pickup',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Error cancelling pickup:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel pickup';
    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};
