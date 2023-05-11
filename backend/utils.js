/**נשתמש בחבילת jsonewbtoken
 טוקן שיווצר עם JWT
 שצאפשר לאמת את המשתמשים מבלי לאחסן מידע עליהם במערכת ובעצם יוצרים טוקן מיוחד לכמות זמן שנבחר
 */

import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

// פונקציה שנעביר אותה בבקשת אקיוס מהצד שרת שנקבל בבקשת צד לקוח
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    //נבדוק האם קיים משתמש מחובר
    const token = authorization.slice(7, authorization.length); // נקבל את החלק של הטוקן על ידי חתיכה של המילה ,brearer ששלחנו
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      // נוודא שהטוקן שקיבלתי נכון וקיים
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};


//פונקציה שצבדוק האם המשתמש המחובר הוא אדמין
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};
