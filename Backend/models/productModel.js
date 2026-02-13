const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Product Code Is Required"],
      unique: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Product Quantity Is Required"],
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceAfterDiscount: {
      type: Number,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      url: String,
      public_id: String,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product Must Belong To Category"],
    },
    
    featured: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    tagsText: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
productSchema.index({ code: 1 }, { unique: true });

productSchema.index({
  code: "text",
  description: "text",
  tagsText: "text",
});

productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
