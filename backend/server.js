import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./Routes/ProductRoutes.js";
import seedRouter from "./Routes/seedRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";



dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });

const app = express();

// המרת הקבצים לגייסון
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


//ניצור בקשה שנוכל להחזיר את הפייפל לצד לקוח
app.get('/api/keys/paypal', (req,res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
});

app.use('/api/products', productRouter) ;
app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
})



// איזה פורט השרת צריך להאזין
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
