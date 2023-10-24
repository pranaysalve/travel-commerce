const router = require('express').Router();
const authController = require('../controllers/authController');
const CheckoutController = require('../controllers/checkoutController');

router.use(authController.protect);

router
  .get('/', CheckoutController.GetAllBookings)
  .post('/', CheckoutController.Checkout);

module.exports = router;
