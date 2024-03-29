import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    comment: { type: String, required: true, maxLength: 400, minLength: 1 },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    gander: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true, //מתי אותו מוצר התווסף או עודכן במסד נתונים
  }
);

//זהו המודל למסד-הנתונים וגם הפרמטר שאיתו נוכל לבצע בקשות HTTP על סמך הנתונים מהמודל:
const Product = mongoose.model("Product", productSchema);
export default Product;
