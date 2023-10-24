const { default: mongoose } = require('mongoose');

const CartSchema = new mongoose.Schema({
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
    unique: true,
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

CartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tours.tour',
    select: '',
  });

  next();
});
CartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'coupon',
    select: '',
  });

  next();
});

module.exports = mongoose.model('Cart', CartSchema);
