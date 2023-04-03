/**נשתמש בחבילת jsonewbtoken
 טוקן שיווצר עם JWT
 שצאפשר לאמת את המשתמשים מבלי לאחסן מידע עליהם במערכת ובעצם יוצרים טוקן מיוחד לכמות זמן שנבחר
 */

import  jwt  from "jsonwebtoken";

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