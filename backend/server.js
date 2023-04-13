import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import data from "./data.js";
import productRouter from "./Routes/ProductRoutes.js";
import seedRouter from "./Routes/seedRoutes.js";
import userRouter from "./Routes/userRoutes.js";



dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });

// app.get("/api/products", (req, res) => {
//   res.send(data.products);
// });
const app = express();

// המרת הקבצים לגייסון
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRouter) ;

app.use('/api/seed', seedRouter);

app.use('/api/users', userRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
})




// //בקשה לייבא מוצר אחד לדף שלנו productScreen
// app.get("/api/products/:slug", (req, res) => {
//   const product = data.products.find(x => x.slug === req.params.slug)
//   if (product) {
//     res.send(product);
//   }else{
//     res.status(404).send({massage: "Product not found"})
//   }
// });

// //בקשה של קבלת מוצר לפי הID 
// app.get('/api/product/:id', (req, res) => {
//   const product = data.products.find(item => item._id === req.params.id);
//   if (product) {
//     res.send(product);
//   }else{
//     res.status(404).send({massage: "Product not found by id"})
//   }

// });

// איזה פורט השרת צריך להאזין
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
