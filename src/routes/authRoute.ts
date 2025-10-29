import express from 'express';
import {
  verifyRiderPhone,
  verifyUserPhone,
  saveUserFromContract,
} from '../controllers/authController';

const router = express.Router();

router.post('/riders/verify-phone', verifyRiderPhone);
router.post('/users/verify-phone', verifyUserPhone);
router.post('/save-user', saveUserFromContract);

export default router;
