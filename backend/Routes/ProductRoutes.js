import  express  from "express";
import Product from "../Models/ProductModel.js";

const productRouter = express.Router();

productRouter.get('/', async (req,res) => {
    const products = await Product.find();
    res.send(products);
});

//בקשה ליבוא מוצר אחד לדף שלנו productScreen
productRouter.get("/product/:slug", async (req, res) => {
    const product = await Product.findOne({slug: req.params.slug} )
    if (product) {
      res.send(product);
    }else{
      res.status(404).send({massage: "Product not found"})
    }
});
  
//בקשה של קבלת מוצר לפי הID 
productRouter.get("/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    }else{
      res.status(404).send({massage: "Product not found by id"})
    }
  
});

export default productRouter;