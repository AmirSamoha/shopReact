import fs from 'fs';
import mongoose from "mongoose";
import Product from './Models/ProductModel.js';
import dotenv from 'dotenv';


dotenv.config();

// Connect to DB
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });

const products = JSON.parse( // להמיר את הקובץ שיש בו מחרוזות לקובץ גייסון
    fs.readFileSync('./seedProducts.json', "utf-8") //.הקובץ אשר יכיל את כל הפרטים של המוצרים בJSON
);

// Add data
const importData = async () => {
    try {
        await Product.create(products); //נאכלס את מסד הנתונים על ידי קרייט 
        console.log("Data Imported...");
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Product.deleteMany(); // פקודה זו מוחקת את כל הנתונים במסד נתונים לא להתשמש בה סתם
        console.log("Data Destroyed...");
        process.exit();
    } catch (err) {
        console.error(err);
    }
};


//תנאי בהזנה בטרמינל אם הערך במקום ה2 יהיה די נגיע לפונקציה של המחיקה
if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}
