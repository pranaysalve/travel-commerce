const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getOneCoupon = factory.getOne(Coupon);
exports.getAllCoupon = factory.getAll(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);
exports.updateCoupon = factory.getAll(Coupon);
exports.createNewCoupon = catchAsync(async (req, res, next) => {
  try {
    const { name, expire, discount } = req.body;
    console.log(req.body);
    const doc = await Coupon.create({
      name: name,
      expire: expire,
      discount: discount,
    });
    console.log(doc);
    res.status(200).json({
      status: 'success',
      results: 1,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    return next(new AppError(err, 404));
  }
});
