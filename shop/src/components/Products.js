import {React,useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { Store } from "../Store";
import { toast, ToastContainer } from 'react-toastify';

//קומפוננטה שתציג כל מוצר בנפרש
export const Products = (props) => {
  const { product, indexOfProduct } = props;



//function  add items to the cart
const {state, dispatch: ctxDispatch } = useContext(Store);
const { cart } = state;

const addToCart = async(product) => {
    const existInCart = cart.cartItems.find((item) => item._id === product._id); //נבדוק האם המוצר שהוספנו כבר קיים בעגלה

    const quantity = existInCart ? existInCart.quantity + 1 : 1; //  אם המוצר כבר קיים בעגלה נעלה את כמות אותו המוצר בעגלה אם המוצר לא קיים יופיע 1

    const { data } = await axios.get(`/api/products/product/${product._id}`);

    if (data.countInStock < quantity) { // תנאי: האם הכמות שבמלאי קטנה מהכמות שנבחרה לעגלה לא מתאפשר  כי נעבור את כמות המוצרים שקיימים במלאי 
      window.alert(`We have only ${data.countInStock} units in stock`);
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {...product, quantity: quantity}, // פרמטר זה יקבל את המוצר וכמות המוצר
    });

    toast.success(`added ${product.name}`, {
      autoClose: 1000, // notification will close after 3 seconds
      closeButton: true, // display a close button
      
    });

};

  return (
    <Card>
      <ToastContainer position='top-right' limit={5}/>
      <span className="indexOfProduct">{`#${indexOfProduct + 1}`}</span>
      <div className="product" key={product.slug}>
        <Link className="link" to={`/product/${product.slug}`}>
          <img src={product.image} alt="error-img" className="card-img-top" />
        </Link>
        <Card.Body>
          <Link className="link" to={`/product/${product.slug}`}>
            <Card.Title>{product.name}</Card.Title>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text>{product.price}$</Card.Text>
          <Card.Text>
            {" "}
            <strong>In Stock:</strong>{" "}
            {product.countInStock > 0 ? (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {" "}
                {product.countInStock} items{" "}
              </span>
            ) : (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {" "}
                {product.countInStock} items{" "}
              </span>
            )}
          </Card.Text>
          {product.countInStock === 0 ? (<Button variant="danger" disabled> Out Of Stock</Button>) : 
          <Button bg="dark" onClick={() => addToCart(product)}>Add To card</Button>}
        </Card.Body>
      </div>
    </Card>
  );
};

export default Products;
