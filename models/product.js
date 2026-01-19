const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: { type: String, required: true, trim: true }, // dynamic

    pricePerKg: { type: Number, required: true, min: 1 },

    quantity: { type: Number, required: true, min: 1 },

    unit: { type: String, enum: ['KG', 'TON'], default: 'KG' },

    description: { type: String, trim: true },

    harvestDate: { type: Date, required: true },

    location: {
      state: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      pincode: {
        type: String,
        required: true,
        match: /^[1-9][0-9]{5}$/
      }
    },

    // media URLs from upload API
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['IMAGE', 'VIDEO'], default: 'IMAGE' }
      }
    ],

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: ['AVAILABLE', 'SOLD_OUT', 'BLOCKED'],
      default: 'AVAILABLE'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
