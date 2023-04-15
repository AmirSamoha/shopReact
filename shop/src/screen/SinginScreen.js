import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {Container, Form, Button} from 'react-bootstrap';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const SinginScreen = () => {
    const { search } = useLocation(); // ניקח את כל מה שרשום לאחר הסימן שאלה בכתובת URL
    const redirectInUrl = new URLSearchParams(search).get('redirect'); // ניקח רק את המונח הספציפי הזה שקבענו רידיירקט והוא שווה לתוכן שרשום בפנים 
    const redirect = redirectInUrl ? redirectInUrl : '/'; 
    const navigate = useNavigate();

    //useContexs global
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { userInfo } = state;

    //useState
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //useEffect
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    },[navigate, redirect, userInfo]);


    const submitHendler = async(e) => {
        e.preventDefault();
        try{
            const { data } = await axios.post('/api/users/signin', {email, password});

            ctxDispatch({type: 'USER_SIGNIN', payload: data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            Navigate( redirect || '/' );
            

        } catch(err) {
            toast.error('The user Not exists in the system ', {
                autoClose: 3000, // notification will close after 3 seconds
                closeButton: true, // display a close button
                
              });
            
        }

    };

    return (
        <div>
        <Container className="small-container">
        <ToastContainer position='top-center' limit={1}/>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form onSubmit={submitHendler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required  onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="mb-3">New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>

    </div>
    );
}

export default SinginScreen;