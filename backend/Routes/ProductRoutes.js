import express from "express";
import Product from "../Models/ProductModel.js";
import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

//בקשה ליצירת מוצר חדש
productRouter.post("/", isAuth, isAdmin, async (req, res) => {
  // נבדוק שיש טוקן למשתמש ושהוא אדמין
  const newProduct = new Product({
    //יצירת מוצר חדש
    name: "sample name " + Date.now(), //נגדיר ברירת מחדל ותאריך ההוראה
    slug: "sample-name-" + Date.now(),
    image: "/images/p1.jpg",
    price: 0,
    category: "sample category",
    gander: "sample gander",
    brand: "sample brand",
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    description: "sample description",
  });

  const product = await newProduct.save(); // שמירת המוצר במסד נתונים
  res.send({ message: "Product Created", product }); // ונחזיר את המוצר החדש לצד לקוח
});

// בקשה לעדכון מוצר קיים על פי האיי די
productRouter.put("/product/:id", isAuth, isAdmin, async (req, res) => {
  const productId = req.params.id; // נשלוף את האיי די מהנתיב יו אר אל
  const product = await Product.findById(productId); // מצתא את המוצר לי איי די
  if (product) {
    // אם המוצר קיים נעדכן את השדות השמורים לפי גוף הבקשה שנלח מהצד לקוח
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.images = req.body.images;
    product.category = req.body.category;
    product.gander = req.body.gander;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    await product.save();
    res.send({ message: "Product Updated" });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

//בקשה לדירוג המוצר והוספת תגובה
productRouter.post("/product/:id/reviews", isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    if (product.reviews.find((x) => x.username === req.user.username)) { //בדיקה האם המשתמש כבר שלח ביקורת על המוצר לא ניתן לשלוח לשוב
      return res.status(400).send({ message: "You already submitted a review" });}
    const review = {
      username: req.user.username,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length; //מתעדכן באורך החדש של מערך הביקורות, המייצג את המספר הכולל של ביקורות על המוצר.
    product.rating = //מחושב על ידי הקטנת מערך הביקורות וסיכום ערכי הדירוג, ולאחר מכן חלוקתו באורך מערך הביקורות כדי לקבל את הדירוג הממוצע.
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      message: "Review Created",
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      numReviews: product.numReviews,
      rating: product.rating,
    });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

//מחיקת מוצר
productRouter.delete("/product/:id", isAuth, isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.send({ message: "Product Deleted" });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

const PAGE_SIZE_SEARCH = 4;
const PAGE_SIZE_ADMIN = 5;

//קבלת כל המוצרים בעמוד האדמין
productRouter.get("/admin", isAuth, isAdmin, async (req, res) => {
  const { query } = req; // מתוך הבקשה נשלוף רק את הקאורי כלומר המפתחות בנתיב יו אר אל
  const page = query.page || 1;
  const pageSize = query.pageSize || PAGE_SIZE_ADMIN;

  const products = await Product.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments();

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

productRouter.get("/search", async (req, res) => {
  const { query } = req; // מתוך הבקשה נשלוף רק את הקאורי כלומר המפתחות בנתיב יו אר אל
  //נשלוף את כל מה שיש בפנים ונגדיר שהשם יהיה מה שהגיע  או מחזורת ריקה
  const pageSize = query.pageSize || PAGE_SIZE_SEARCH;
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
            $gte: Number(price.split("-")[0]), // גדול מ1 ושווה ל1
            $lte: Number(price.split("-")[1]), // קטן מ50 ושווה ל50
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

//בקשות ליבוא את הקטגוריות מתוך המסד נתונים
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

export default productRouter;
