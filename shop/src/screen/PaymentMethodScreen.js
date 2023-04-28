import React, { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckSteps from "../components/CheckSteps";
import { Helmet } from "react-helmet-async";
import { Form, Button } from "react-bootstrap";

const PaymentMethodScreen = () => {
  const { state, dispatch: ctxDidpatch } = useContext(Store);
  const {cart: { shippingAddress, paymentMethod },} = state;

  const navigate = useNavigate();

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod //|| "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      //ננווט חזרה את המשתמש אם ישנה תקלה בכתובת המשלוח או שהוא לא הזין
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHendler = (e) => {
    e.preventDefault();
    ctxDidpatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethodName));
    navigate("/placeorder");
  };

  return (
    <div>
      <CheckSteps step1 step2 step3></CheckSteps>
      {/* <div className='large-container'>
            <Helmet>
                <title>Payment Method </title>
            </Helmet>
            <h1>Payment Method</h1>
            <Form onSubmit={submitHendler}>
                <div className='mb-3'>
                    <Form.Check type='radio' id='PayPal' label='PayPal' value='PayPal'
                    checked={paymentMethodName === 'PayPal'}
                    onChange={(e) => setPaymentMethodName(e.target.value)}></Form.Check>
                </div>
                <div className='mb-3'>
                    <Button type='sumbit'>Continue</Button>
                </div>
            </Form>
        </div> */}

      <Helmet>
        <title>Payment Method </title>
      </Helmet>
      <h1>Payment Method</h1>

      <Form onSubmit={submitHendler}>
        <div className="mb-3">
          <Form.Check type="radio">
            <Form.Check.Input
              id="PayPal"
              type="radio"
              isValid
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              name="payment"
            ></Form.Check.Input>
            <Form.Check.Label>PayPal</Form.Check.Label>
          </Form.Check>
        </div>

        <div className="mb-3">
          <Form.Check type="radio">
            <Form.Check.Input
              id="ApplePay"
              type="radio"
              isValid
              value="Apple Pay"
              onChange={(e) => setPaymentMethodName(e.target.value)}
              name="payment"
            ></Form.Check.Input>
            <Form.Check.Label>Apple Pay</Form.Check.Label>
          </Form.Check>
        </div>

        <div className="mb-3">
          <Form.Check type="radio">
            <Form.Check.Input
              id="GooglePay"
              type="radio"
              isValid
              value="Google Pay"
              onChange={(e) => setPaymentMethodName(e.target.value)}
              name="payment"
            ></Form.Check.Input>
            <Form.Check.Label>Google Pay</Form.Check.Label>
          </Form.Check>
        </div>

        <div className="mb-3">
          <Button type="sumbit">Continue</Button>
        </div>
      </Form>
    </div>
  );
};

export default PaymentMethodScreen;
