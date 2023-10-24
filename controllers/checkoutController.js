const Checkout = require('../models/checkout');
const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.Checkout = catchAsync(async (req, res, next) => {
  const data = req.body.data;
  const { tours, coupon, cartTotal, totalAfterDiscount } = data;
  try {
    const NewCheckout = await Checkout.create(data[0]);
    const RemoveCart = await Cart.findOneAndDelete(data[0]);

    return res.status(200).json({
      status: 'success',
      data: {
        data: NewCheckout,
      },
      cart: {
        message: 'Cart Clean',
        data: RemoveCart,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
});

exports.GetAllBookings = catchAsync(async (req, res, next) => {
  try {
    const Bookings = await Checkout.find({ user: req.user.id });
    if (!Bookings) {
      return res.status(200).json({
        status: 'success',
        message: 'no booking found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        data: Bookings,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
});
