const express = require('express');
const CartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(CartController.getCartItems)
  .post(CartController.addItemToCart)
  .delete(CartController.removeItemFromCart);

router.post('/coupon', CartController.addRemoveCoupon);

module.exports = router;
