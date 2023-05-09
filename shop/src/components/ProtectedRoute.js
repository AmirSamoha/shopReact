import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store.js";
 


//קומפוננטה שנוכל לעטוף חלקים בקוד שנרצה שרק משתמש מחובר יוכל להכנס אליהם
const ProtectedRoute = ({ children }) => {
    const { state } = useContext(Store);
    const { userInfo } =  state;
  return userInfo ? children : <Navigate to="/signin" />

};

export default ProtectedRoute;
