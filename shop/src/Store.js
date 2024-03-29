import { createContext, useReducer } from "react";

export const Store = createContext();

//מצב התחלתי עגלה ריקה
const initialState = {
  //user initialState
  userInfo: localStorage.getItem("userInfo") // נבדוק האם נמצא משתמש קיים בלוקל סטורץ
    ? JSON.parse(localStorage.getItem("userInfo")) // אם קיים משתמש נמיר את המידע שיש על המשתמש לקובץ גייסון
    : null, // אם לא נתחיל מצב התחלתי של מידע על המשתמש במצב ריק

  //cart initialState
  cart: {
    //payment method initialState
    paymentMethod: localStorage.getItem("paymentMethod") // נבדוק אם יש לנו נתונים של אמצעי תשלום בלוקל סטורץ
      ? JSON.parse(localStorage.getItem("paymentMethod")) // אם קיים כתובות נמיר את המידע שיש  לקובץ גייסון
      : "",

    //shipping address initialState
    shippingAddress: localStorage.getItem("shippingAddress") // נבדוק אם יש לנו נתונים של כתובת המשלוח בלוקל סטורץ
      ? JSON.parse(localStorage.getItem("shippingAddress")) // אם קיים כתובות נמיר את המידע שיש על כתובות לקובץ גייסון
      : [],

    //cart items initialState
    cartItems: localStorage.getItem("cartItems") //נבדוק אם נשמר לנו בלוקל מידע אם כן נחזיר אותו אם לא נחזור למצב התחלתי עגלה ריקה
      ? JSON.parse(localStorage.getItem("cartItems")) //אם קיים מוצרים נמיר את המידע שיש על המוצרים לקובץ גייסון
      : [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload; //אובייקט חדש בתוספת ה quantity: quantity בדף ProductScreen
      //console.log(newItem);
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      //console.log(existItem);
      const cartItems = existItem ? 
      state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item) : 
      [...state.cart.cartItems, newItem];
      
    //  console.log(cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };

    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
      };

    case "SAVE_PAYMENT_METHOD":
      return {...state, cart: { ...state.cart, paymentMethod: action.payload } };

    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
};
