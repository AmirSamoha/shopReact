import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {Container, Form, Button} from 'react-bootstrap';


const SinginScreen = () => {
    const { search } = useLocation(); // ניקח את כל מה שרשום לאחר הסימן שאלה בכתובת URL
    const redirectInUrl = new URLSearchParams(search).get('redirect'); // ניקח רק את המונח הספציפי הזה שקבענו רידיירקט והוא שווה לתוכן שרשום בפנים 
    const redirect = redirectInUrl ? redirectInUrl : '/'; 
    return (
        <div>
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="mb-3">New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div></Form></Container>

    </div>
    );
}

export default SinginScreen;