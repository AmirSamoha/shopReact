import express from 'express';
import data from '../data.js';
import User from '../Models/UserModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    /**נשתמש רק באחת השורות או למחוק או להכניס משתמשים בכך שנשים אחד מהם בהערה */
    //await User.deleteMany({}); /** מה שיש בדאטא בייס כל מה שנמצא תחת הסכמה יוזר ימחק הכל */
    // const createdUsers = await User.insertMany(data.users); /** נכניס את היוזרים שנמצאים בתוך הקובץ דאטא לתוך הדאטא בייס*/
    // res.send({ createdUsers });
});
export default seedRouter;