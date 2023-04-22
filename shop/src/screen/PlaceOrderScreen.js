import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import CheckSteps from "../components/CheckSteps";
import { Helmet } from "react-helmet-async";
import { Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";

//reducer local
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrderScreen = () => {
  //store global
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const navigate = useNavigate();

  //useReducer
  const initialState = {
    //מצב התחלתי לפני השינוי
    loading: false,
  };
  const [{ loading }, dispatch] = useReducer(reducer, initialState);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await axios.post("/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
            //מי שיוכל לבצע הזמנה זה רק משתמש שיש לו טוקן והוא רשאי להזמין
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);//לאחר ההזמנה ננוט לדף הסיכום הזמנה עם האיי די של ההזמנה
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(" some error");
    }
  };

  useEffect(() => {
    //אם לא קיים אמצעי תשלום ננוט לדף הבחירת תשלום
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const roundTotal = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //פונקציה אשר תעגל ותשאיר שני ספרות אחרי הנקודהה
  cart.itemsPrice = roundTotal(
  cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)); // סהכ המחיר של כל המוצרים בעגלה
  cart.shippingPrice = cart.itemsPrice > 100 ? roundTotal(0) : roundTotal(10); //  מחיר המשלוח אם סהכ המוצרים עוברים את 100 אז משלוח חינם
  cart.taxPrice = roundTotal(0.15 * cart.itemsPrice); // הוספת תשלופ מיסים
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice; //נציג את המחיר של סהכ ביחד

  return (
    <div>
      <div>
        <CheckSteps step1 step2 step3 step4></CheckSteps>
        <Helmet>
          <title>Preview Order</title>
        </Helmet>
        <h1 className="my-3">Preview Order</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  ,{cart.shippingAddress.country}
                </Card.Text>
                <Link to="/shipping">Edit</Link>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {cart.paymentMethod}
                </Card.Text>
                <Link to="/payment">Edit</Link>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid order-img"
                          ></img>{" "}
                          <Link className="link" to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>${item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to="/cart">Edit</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${cart.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong> Order Total</strong>
                      </Col>
                      <Col>
                        <strong>${cart.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        Place Order
                      </Button>
                    </div>
                    {loading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
