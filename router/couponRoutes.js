const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Create a new coupon
router.post('/coupons', couponController.createCoupon);

// Read all coupons
router.get('/coupons', couponController.getAllCoupons);

// Read a specific coupon by ID
router.get('/coupons/:id', couponController.getCouponById);

// Update a coupon by ID
router.put('/coupons/:id', couponController.updateCoupon);

// Delete a coupon by ID
router.delete('/coupons/:id', couponController.deleteCoupon);

module.exports = router;
