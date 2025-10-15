import express from 'express';
import { verifyRiderPhone, verifyUserPhone } from '../controllers/authController';

const router = express.Router();

router.post('/riders/verify-phone', verifyRiderPhone);
router.post('/users/verify-phone', verifyUserPhone);

export default router;
