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
    console.log({ coupon });
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
        try {
          AvailableCart.coupon = CouponData.id;

          AvailableCart.totalAfterDiscount -=
            AvailableCart.totalAfterDiscount * (CouponData.discount / 100);
          const updatedCart = await AvailableCart.save();

          res.status(200).json({
            status: 'success',
            results: updatedCart.length,
            data: {
              data: updatedCart,
            },
          });
        } catch (error) {
          console.error('Error:', error);
          res
            .status(500)
            .json({ status: 'error', message: 'An error occurred.' });
        }
      }
      if (type === 'remove') {
        AvailableCart.totalAfterDiscount = AvailableCart.cartTotal;
        const updatedCart = await AvailableCart.save();
        res.status(200).json({
          status: 'success',
          results: updatedCart.length,
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
    const { _id, price } = req.body.tour;
    const AvailableCart = await Cart.findOne({ user: req.user.id });
    const isCouponAdded = AvailableCart.coupon;
    if (isCouponAdded) {
      try {
        const UpdateCart = await Cart.findOneAndUpdate(
          {
            user: req.user.id,
            'tours.tour': _id,
            'tours.price': price,
          },
          {
            $pull: {
              tours: {
                tour: _id,
                price: price,
              },
            },
          },
          { new: true },
        );
        let cartTotal = 0;
        let totalAfterDiscount = 0;
        cartTotal = UpdateCart.tours
          .map((tour) => tour.price)
          .reduce((accu, currVal) => accu + currVal, 0);
        totalAfterDiscount =
          cartTotal - cartTotal * (UpdateCart.coupon.discount / 100);
        UpdateCart.cartTotal = cartTotal;
        UpdateCart.totalAfterDiscount = totalAfterDiscount;
        const doc = await UpdateCart.save();
        console.log({ cartTotal, totalAfterDiscount, doc });
        return res.status(200).json({
          status: 'success',
          results: doc.length,
          data: {
            data: doc,
          },
        });
      } catch (error) {
        console.error('Error:', error);
        return res
          .status(500)
          .json({ status: 'error', message: 'An error occurred.' });
      }
    }

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
      results: updatedCart.length,
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
      AvailableCart.coupon = null;
      AvailableCart.cartTotal += price;
      AvailableCart.totalAfterDiscount += price;

      const updatedCart = await AvailableCart.save();

      res.status(200).json({
        status: 'success',
        results: updatedCart.length,
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
