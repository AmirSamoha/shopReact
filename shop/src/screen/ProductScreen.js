import { React, useReducer, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Col, ListGroup, Row, Button, Badge } from "react-bootstrap";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import { toast, ToastContainer } from 'react-toastify';
import { getError } from "../utilsFront";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST": //מצב שבו אנו שולחים את הבקשה לשרת נשמור על הערכים הישנים של סטייט ונגדיר את ההמתנה לאמת
      return { ...state, loading: true };
    case "FETCH_SUCCESS": // מצב שבו הבקשה נשלחה בהצלחה לשרת-נקבל שוב את הערכים הישנים של סטייט ונעדכן את המוצרים מהמידע שחוזר אקשיין.פיילוד מכיל את המוצרים מצד השרת
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL": // מצב שבו חזרה שגיאה מהבקשה לצד שרת
      console.log(action.payload);
      return { ...state, error: action.payload, loading: false };
    default: //מצב שבו לא מתרחש שום מקרה נחזיר את המצב הנוכחי
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  //reducer
  const initialState = { //מצב התחלתי לפני השינוי 
    product: [],
    loading: true,
    error: "",
  }

  const [{ product, loading, error }, dispatch] = useReducer(reducer, initialState);

  //effect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [slug]);



//function to add items to the cart

const {state, dispatch: ctxDispatch } = useContext(Store);
const { cart } = state;

const addToCart = async() => {
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
    autoClose: 1000, // notification will close after 1 seconds
    closeButton: true, // display a close button
    
  });
};

  return loading ? (
    <div> Loading... <LoadingBox /></div>
  ) : error ? (
    <div> {error}</div>
  ) : (
    <div className="container">
          <ToastContainer position='top-left' limit={5}/>
      <Row>
        <Col sm={4}>
          <img className="img-item" src={product.image} alt={product.slug} />
        </Col>
        <Col sm={4}>
          <ListGroup variant="flash" className="info">
            <ListGroup.Item>
              <Helmet>
                {" "}
                {/* ישים את השם של המוצר בתור השם של האתר */}
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Brand: {product.brand}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Category: {product.category}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Price: {product.price}$</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
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
                  )}{" "}
                </Col>
                <Col>
                  {product.countInStock > 0 ? (
                    <Badge bg="success">In stock </Badge>
                  ) : (
                    <Badge bg="danger">Out of stock</Badge>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            {product.countInStock > 0 ? (
              <ListGroup.Item>
                <Button onClick={addToCart}>Add To card</Button>
              </ListGroup.Item>
            ) : null}
          </ListGroup>
        </Col>
      </Row>
      <div className="description">
        <h4>{product.description}</h4>
      </div>
    </div>
  );
}

export default ProductScreen;
