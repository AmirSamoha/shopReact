import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { Col, ListGroup, Row, Button,Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
// import axios from "axios";

const CartScreen = () => {
  const navigate = useNavigate();

  //נייבא את המידע מהסטור
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems },} = state;

  //פונקציה לעידכון את כמות המוצרים בעגלה על ידי כפתורי הפלוס ומינוס
  const updateCart = async  (item, quantity) => {
    // const {data} = await axios.get(`/api/products/product/${item._id}`);

    // if (data.countInStock  < quantity) {
    //   window.alert(`We have only ${data.countInStock} units in stock`);
    //   return;
    // }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {...item, quantity: quantity}
    })

  };

  //פונקציה להסרת מוצר בעגלת הקניות 
  const removeItem = (item) => {
    ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item});
  };

  //פונקציה לנייוט המשתמש לעמוד סיום הרכישה 
  const checkOut = () => {
    navigate('/signin?redirect=/shipping');
  }

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="my-3">Shopping Cart</h1>
      <Row>
        <Col sm={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center cart-items">
                    <Col md={2}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid .order-img"
                      ></img>{" "}
                      <Link className="link" to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button variant="light" onClick={() => updateCart(item, item.quantity - 1)} disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button variant="light" onClick={() => updateCart(item, item.quantity + 1)} disabled={item.quantity === item.countInStock }>
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button variant="light" onClick={() => removeItem(item)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    total ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkOut}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
              };

export default CartScreen;
