import axios from "axios";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../Store";
import { Container, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const SignupScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation(); // ניקח את כל מה שרשום לאחר הסימן שאלה בכתובת URL
  const redirectInUrl = new URLSearchParams(search).get("redirect"); //  ניקח רק את המונח הספציפי הזה שקבענו רידיירקט והוא שווה לתוכן שרשום בפנים אחרי הסימן שווה
  const redirect = redirectInUrl ? redirectInUrl : "/";

  //useContext global
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  //useState local
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    try {
      const { data } = await axios.post("/api/users/signup", {
        firstName,
        lastName,
        username,
        email,
        password,
      }); // נעביר את הפרמטרים לבקשה לצד שרת
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error("username or email already exists");
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title> Sign Up</title>
      </Helmet>
      <h1>Sign Up</h1>
      <ToastContainer position='top-center' limit={1}/>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control onChange={(e) => setFirstName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control onChange={(e) => setLastName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control onChange={(e) => setUsername(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already a user?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignupScreen;
