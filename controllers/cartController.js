const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCartItems = catchAsync(async (req, res, next) => {
  const doc = await Cart.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.addRemoveCoupon = catchAsync(async (req, res, next) => {
  try {
    const { coupon, type } = req.body;
    const CouponData = await Coupon.findOne({ name: coupon });

    const isCouponAdded = await Cart.findOne({ coupon: CouponData._id });

    if (isCouponAdded) {
      return res.status(200).json({
        status: 'success',
        message: 'Coupon Already Added',
      });
    }
    const AvailableCart = await Cart.findOne({ user: req.user.id });
    if (CouponData && AvailableCart) {
      if (type === 'add') {
        AvailableCart.coupon = CouponData.id;
        AvailableCart.totalAfterDiscount -=
          AvailableCart.totalAfterDiscount * (CouponData.discount / 100);
        const updatedCart = await AvailableCart.save();

        res.status(200).json({
          status: 'success',
          results: updatedCart.length, // You are updating a single document
          data: {
            data: updatedCart,
          },
        });
      }
      if (type === 'remove') {
        AvailableCart.totalAfterDiscount = AvailableCart.cartTotal;
        const updatedCart = await AvailableCart.save();
        res.status(200).json({
          status: 'success',
          results: updatedCart.length, // You are updating a single document
          data: {
            data: updatedCart,
            coupon: CouponData,
          },
        });
      }
    }
  } catch (error) {
    return next(new AppError(error, 404));
  }
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  try {
    const { _id, price } = req.body.data;
    const AvailableCart = await Cart.findOne({ user: req.user.id });
    const RemoveCart = {
      tour: _id,
      price: price,
    };

    AvailableCart.tours.pop(RemoveCart);

    AvailableCart.cartTotal -= price;
    AvailableCart.totalAfterDiscount -= price;
    const updatedCart = await AvailableCart.save();
    res.status(200).json({
      status: 'success',
      results: updatedCart.length, // You are updating a single document
      data: {
        data: updatedCart,
      },
    });
  } catch (error) {
    return next(new AppError(error, 404));
  }
});

exports.addItemToCart = catchAsync(async (req, res, next) => {
  try {
    const { _id, price } = req.body.data;
    const AvailableCart = await Cart.findOne({ user: req.user.id });

    if (AvailableCart) {
      const isTourAvailableInCart = AvailableCart.tours.some((tour) => {
        console.log(tour.tour._id.toString() === _id.toString());
        return tour.tour._id.toString() === _id.toString();
      });

      if (isTourAvailableInCart) {
        return res.status(200).json({
          status: 'success',
          results: AvailableCart.length,
          data: {
            data: AvailableCart,
          },
        });
      }

      const AddCart = {
        tour: _id,
        price: price,
      };

      AvailableCart.tours.push(AddCart);

      AvailableCart.cartTotal += price;
      AvailableCart.totalAfterDiscount += price;

      const updatedCart = await AvailableCart.save();

      res.status(200).json({
        status: 'success',
        results: updatedCart.length, // You are updating a single document
        data: {
          data: updatedCart,
        },
      });
    } else {
      // Create a new cart
      const newCart = {
        tours: [
          {
            tour: _id,
            price: price,
          },
        ],
        cartTotal: price,
        totalAfterDiscount: price,
        user: req.user.id,
      };

      const doc = await Cart.create(newCart);

      res.status(200).json({
        status: 'success',
        results: 1, // You are creating a single document
        data: {
          data: doc,
        },
      });
    }
  } catch (error) {
    return next(new AppError(error, 404));
  }
});
