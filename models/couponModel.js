const { default: mongoose } = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    uppercase: true,
  },
  expire: {
    type: String,
    // required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Coupon', CouponSchema);
