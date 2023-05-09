import express from "express";
import Product from "../Models/ProductModel.js";
import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 4;

productRouter.get("/search", async (req, res) => {
  const { query } = req; // מתוך הבקשה נשלוף רק את הקאורי כלומר המפתחות בנתיב יו אר אל
  //נשלוף את כל מה שיש בפנים ונגדיר שהשם יהיה מה שהגיע  או מחזורת ריקה
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const order = query.order || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery, //פניה למונגו די בי 
            $options: "i", // כדי שלא יבדיל בין אותיות קטנות או גדולות נוכל לחפש מוצר בכל הדרכים
          },
        }
      : {};

  const categoryFilter = category && category !== "all" ? { category } : {};

  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating), // אופרטור למונגו דיבי שיוצר ךזהות את המוצרים עם רייטינג של גדול מ ושווה ל 
          },
        }
      : {};

  const priceFilter =
    price && price !== "all"
      ? {
          // 1-50
          price: {
            $gte: Number(price.split("-")[0]),// גדול מ1 ושווה ל1
            $lte: Number(price.split("-")[1]),// קטן מ50 ושווה ל50 
          },
        }
      : {};

  const sortOrder =
    order === "featured"
      ? { featured: -1 }
      : order === "lowest"
      ? { price: 1 }
      : order === "highest"
      ? { price: -1 }
      : order === "toprated"
      ? { rating: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

productRouter.get("/categories", async (req, res) => {
  const categories = await Product.find().distinct("category");
  res.send(categories);
});

//בקשה ליבוא מוצר אחד לדף שלנו productScreen
productRouter.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ massage: "Product not found" });
  }
});

//בקשה של קבלת מוצר לפי הID
productRouter.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ massage: "Product not found by id" });
  }
});

//קבלת כל המוצרים בעמוד האדמין 
productRouter.get("/admin", isAuth, isAdmin, async (req, res) => {
  const { query } = req;
  const page = query.page || 1;
  const pageSize = query.pageSize || PAGE_SIZE;

  const products = await Product.find().skip(pageSize * (page - 1)).limit(pageSize);
  const countProducts = await Product.countDocuments();
  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  })
});

export default productRouter;
