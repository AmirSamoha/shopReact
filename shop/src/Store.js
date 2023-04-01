import { createContext, useReducer } from "react";

export const Store = createContext();


//מצב התחלתי עגלה ריקה 
const initialState = {cart: {cartItems: localStorage.getItem('cartItems') ? //נבדוק אם נשמר לנו בלוקל מידע אם כן נחזיר אותו אם לא נחזור למצב התחלתי עגלה ריקה
  JSON.parse(localStorage.getItem('cartItems')) :
  [], },};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM":  
        const newItem = action.payload;//אובייקט חדש בתוספת ה quantity: quantity בדף ProductScreen
        console.log(newItem)
        const existItem = state.cart.cartItems.find(item => item._id === newItem._id);
        console.log(existItem)
        const cartItems = existItem ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item) : [...state.cart.cartItems, newItem];
        console.log(cartItems) 
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    return {...state, cart: { ...state.cart, cartItems}};

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(item => item._id !== action.payload._id);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {...state, cart: { ...state.cart, cartItems}};
        }


    default: 
    return state;
  }
}



export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
