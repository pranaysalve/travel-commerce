const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
  tours: [
    {
      tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
      },
      price: Number,
    },
  ],
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
  },
  cartTotal: Number,
  totalAfterDiscount: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Cart belongs to user!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Checkout', CheckoutSchema);
