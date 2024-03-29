import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store.js";
 


//קומפוננטה שנוכל לעטוף חלקים בקוד שנרצה שרק משתמש הוא אדמין  מחובר יוכל להכנס אליהם
const AdminRoute = ({ children }) => {
    const { state } = useContext(Store);
    const { userInfo } =  state;

  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />

};

export default AdminRoute;
