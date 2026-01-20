const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: { type: String, required: true, trim: true }, // dynamic

    pricePerKg: { type: Number, required: true, min: 1 },

    quantity: { type: Number, required: true, min: 1 },

    unit: { type: String, enum: ["KG", "TON"], default: "KG" },

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

    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["IMAGE", "VIDEO"], default: "IMAGE" }
      }
    ],

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ['DRAFT', 'AVAILABLE', 'SOLD', 'EXPIRED'],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

// ✅ show productId instead of _id in response
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.productId = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Product", productSchema);
