import express from 'express';
import {
  createPayPalOrder,
  capturePayPalOrder,
} from '../controller/paypalpayment.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/v1/paypal/create-order
 * @desc  Create a PayPal order for checkout
 * @access Private (only logged-in buyers)
 */
router.post('/create-order', verifyAuth, createPayPalOrder);

/**
 * @route POST /api/v1/paypal/capture-order/:orderId
 * @desc  Capture the PayPal order after buyer approval
 * @access Private
 */
router.post('/capture-order/:orderId', verifyAuth, capturePayPalOrder);

export default router;
