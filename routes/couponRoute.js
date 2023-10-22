const express = require('express');
const CouponController = require('../controllers/couponController');
// const authController = require('../controllers/authController');

const router = express.Router();

router
  .get('/', CouponController.getOneCoupon)
  .post('/', CouponController.createNewCoupon);

// router.use(authController.restrictTo('admin'));
router
  .get('/all', CouponController.getAllCoupon)
  .delete('/:id', CouponController.deleteCoupon)
  .patch('/:id', CouponController.updateCoupon);

module.exports = router;
