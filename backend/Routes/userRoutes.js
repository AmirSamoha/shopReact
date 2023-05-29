import express from "express";
import bcrypt from "bcryptjs";
import User from "../Models/UserModel.js";
import { isAuth, isAdmin, generateToken } from "../utils.js";

const userRouter = express.Router();

userRouter.get("/", isAuth, isAdmin, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

//בקשה להציג מתשתמש ספציפי בקומפנוננטה של עריכת משתמשים של האדמין
userRouter.get("/:id", isAuth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
});

//בקשה לעדכון משתמש על ידי האדמין
userRouter.put("/:id", isAuth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.send({ message: "User Updated", user: updatedUser });
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
});

//בקשה למחיקת משתמש על ידי האדמין
userRouter.delete("/:id", isAuth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.email === "admin@example.com" || user.isAdmin) { //נוודא שלא ניתן יהיה למחוק משתמש שהוא אדמין
      res.status(400).send({ message: "Can Not Delete Admin User" });
      return;
    }
    await user.deleteOne();
    res.send({ message: "User Deleted" });
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
});
 
//בקשה לכניסה למשתמש שכבר רשום
userRouter.post("/signin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }); //נגיד אם יש משתמש על פי האימייל שלו
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      //בכדי להשוות בין הסיסמה שכתב השתמש לסיסמה במסד compareSync נשתמש בפונקציה של
      res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user), // בשביל המשתמש בהמשך ניצור את JesonWebToken ניצור
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid email or password" });
});

//בקשה לצורך רישום משתמש חדש
userRouter.post("/signup", async (req, res) => {
  const userExist = await User.findOne({
    //מתוך הדאטא בייס שלנו נמצא אחד מהפרמטרים אם הם כבר קיימים במערכת
    $or: [{ email: req.body.email }, { username: req.body.username }], // אימייל או שם משתמש
  });
  if (userExist) {
    return res
      .status(401)
      .json({ message: `username or email already exists` });
  } else {
    const newUser = new User({
      //אם יוזר לא קיים במערכת ניצור מחלקה/משתמש חדש עם הפרמטרים שנשלחו בגוף הבקשה בצד הלקוח שלנו
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password), //שמירת הסיסמא עם גיבוב לסיסמא
    });
    const user = await newUser.save(); // נשמור את המשתמש בדאטא בייס
    res.send({
      // ונשלח בחזרה לצד לקוח שלנו את הפרטמרים הבאים כולל טוקן כדי שיוכל להשתמש בשירותי האתר
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      isAdmin: false,
      token: generateToken(user),
    });
  }
});

//בקשה לבדיקה אם המייל קיים
userRouter.post("/configmail", async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    res.send({
      email: userExist.email,
      //token: generateToken(userExist),
    });
  } else {
    res.status(404).send({ message: "this mail not exists" });
  }
});

//בקשה לאיפוס סיסמא
userRouter.put("/profile", isAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 6);
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: false,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

//  בקשה לאיפוס סיסמא שמהמשתמש לא מחובר
// userRouter.put("/reset-password", async (req, res) => {
//   const isMail = await User.findOne({ email: req.body.email });
//   if (isMail) {
//     if (req.body.password) {
//       isMail.password = bcrypt.hashSync(req.body.password, 6);
//     }

//     const updatedPassUser = await isMail.save();

//     res.send({
//       _id: updatedPassUser._id,
//       username: updatedPassUser.username,
//       email: updatedPassUser.email,
//       isAdmin: false,
//       //token: generateToken(updatedPassUser),
//     });
//   } else {
//     res.status(404).send({ message: "User not found" });
//   }
// });

//  בקשה לאיפוס סיסמא שמהמשתמש לא מחובר + לא יהיה ניתן להשתמש באותה סיסמא
userRouter.put("/reset-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);
  // console.log(req.body.password);
  // console.log(user.password);
  const match = await bcrypt.compare(req.body.password, user.password);
  console.log(match);

  if (match) {
    res.status(400).send({
      message: "You cannot use your old password as the new password.",
    });
  } else {
    user.password = await bcrypt.hash(req.body.password, 6); // נשמור את הסיסמא החדשה במשתנה מהמסד נתונים
    const updateUserPassword = await user.save();

    res.send({
      _id: updateUserPassword._id,
      username: updateUserPassword.username,
      email: updateUserPassword.email,
      isAdmin: false,
      //token: generateToken(updateUserPassword),
    });
  }
});

export default userRouter;
