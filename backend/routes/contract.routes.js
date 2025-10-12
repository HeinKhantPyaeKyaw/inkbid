import express from 'express';
import {
  buyerSignContract,
  sellerSignContract,
} from '../controller/contract.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Either buyer or seller can hit this route
// router.patch("/:articleId/sign", verifyAuth, sellerSignContract);
router.patch('/:articleId/sign', verifyAuth, (req, res, next) => {
  try {
    if (req.user?.role === 'seller') {
      return sellerSignContract(req, res, next);
    } else if (req.user?.role === 'buyer') {
      return buyerSignContract(req, res, next);
    } else {
      return res
        .status(403)
        .json({ success: false, message: 'Unauthorized role' });
    }
  } catch (err) {
    console.error('Error in /contracts/:articleId/sign route: ', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error (contract route)' });
  }
});

export default router;
