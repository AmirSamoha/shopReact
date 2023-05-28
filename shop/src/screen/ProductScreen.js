import {
  React,
  useReducer,
  useEffect,
  useContext,
  useState,
  useRef,
} from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Col, ListGroup, Row, Button, Badge, Card, Form, FloatingLabel } from "react-bootstrap";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../utilsFront";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
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

  const [selectedImage, setSelectedImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  let reviewsRef = useRef();

  //reducer
  const initialState = {
    //מצב התחלתי לפני השינוי
    product: [],
    loading: true,
    error: "",
  };

  const [{ product, loading, error, loadingCreateReview }, dispatch] =
    useReducer(reducer, initialState);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please write a review and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/product/${product._id}/reviews`,
        { rating, comment, username: userInfo.username },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "CREATE_SUCCESS" });

      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;

      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

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

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCart = async () => {
    const existInCart = cart.cartItems.find((item) => item._id === product._id); //נבדוק האם המוצר שהוספנו כבר קיים בעגלה

    const quantity = existInCart ? existInCart.quantity + 1 : 1; //  אם המוצר כבר קיים בעגלה נעלה את כמות אותו המוצר בעגלה אם המוצר לא קיים יופיע 1

    const { data } = await axios.get(`/api/products/product/${product._id}`);

    if (data.countInStock < quantity) {
      // תנאי: האם הכמות שבמלאי קטנה מהכמות שנבחרה לעגלה לא מתאפשר  כי נעבור את כמות המוצרים שקיימים במלאי
      window.alert(`We have only ${data.countInStock} units in stock`);
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity }, // פרמטר זה יקבל את המוצר וכמות המוצר
    });

    toast.success(`added ${product.name}`, {
      autoClose: 1000, // notification will close after 1 seconds
      closeButton: true, // display a close button
    });
  };

  return loading ? (
    <div>
      {" "}
      Loading... <LoadingBox />
    </div>
  ) : error ? (
    <div> {error}</div>
  ) : (
    <div className="container">
      <ToastContainer position="top-left" limit={5} />
      <Row>
        <Col sm={4}>
          <img
            className="img-item"
            src={selectedImage || product.image}
            alt={product.slug}
          />
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
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
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
        <Col sm={4}>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a review</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit Review
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{" "}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{" "}
              to write a review
            </MessageBox>
          )}
        </div>
        </Col>
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no review's for this product</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.username}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
  
      </div>
    </div>
  );
}

export default ProductScreen;
