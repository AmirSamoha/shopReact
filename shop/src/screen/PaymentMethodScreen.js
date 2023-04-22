import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import CheckSteps from '../components/CheckSteps';
import { Helmet } from 'react-helmet-async';
import { Form, Button } from "react-bootstrap";


const PaymentMethodScreen = () => {
    const {state, dispatch: ctxDidpatch } = useContext(Store);
    const { cart:{ shippingAddress, paymentMethod }} = state;
    const navigate = useNavigate();

    const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal');

    useEffect(() => {
        if(!shippingAddress.address){ //ננווט חזרה את המשתמש אם ישנה תקלה בכתובת המשלוח או שהוא לא הזין 
            navigate('/shipping')
        }
    },[shippingAddress, navigate]);

    const submitHendler = (e) => {
        e.preventDefault();
        ctxDidpatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName});
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethodName));
        navigate('/placeorder');

    };

  return (
    <div>
        <CheckSteps step1 step2 step3></CheckSteps>
        <div className='container small-container'>
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
        </div>


    </div>
  )
}

export default PaymentMethodScreen;