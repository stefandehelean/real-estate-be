const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  city: {
    type: String,
    required: true
  },
  sold_price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    required: true
  }
});
const Property = mongoose.model('Property', PropertySchema);
module.exports = Property;