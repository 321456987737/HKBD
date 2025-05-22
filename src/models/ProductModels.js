import mongoose from "mongoose";
const product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalprice: {
    type: String,
    required: true,
  },
  totaldiscount: {
    type: String,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  primaryimage: {
    type: String,
    required: true,
  },
  secondaryimage: {
    type: String,
    required: true,
  },
  size: {
    type: [String], // e.g. ['8', '10', 'S', 'M']
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const productmodel =
  mongoose.models.product || mongoose.model("product", product);
export default productmodel;
