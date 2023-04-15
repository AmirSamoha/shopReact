import React from "react";
import { Col, Row } from "react-bootstrap";

/** 
In each conditional processing we check a condition who  
(step 1, step 2, step 3, step 4) is true and its design (style) will be active,
other it will be disabled.*/

const CheckSteps = (props) => {
  return (
    <div>
      <Row className="checkout-steps">
        <Col className={props.step1 ? 'active' : ''}>Sign In</Col>
        <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
        <Col className={props.step3 ? 'active' : ''}>Payment</Col>
        <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
      </Row>
    </div>
  );
};

export default CheckSteps;
