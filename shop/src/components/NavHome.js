import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Button,
  Form,
  Nav,
  NavDropdown,
  Badge,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utilsFront";

const NavHome = (props) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const navigate = useNavigate();
  const [query, setQuery] = useState();

  const [categories, setCategories] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  //sign out the user function
  const signOutHendler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo"); // נמחק את כל הנתונים הקיימים על המשתמש בלוקל סטורץ
    localStorage.removeItem("shippingAddress"); // נמחק את כל הנתונים הקיימים על הכתובת  בלוקל סטורץ
    localStorage.removeItem("paymentMethod"); // נמחק את כל הנתונים הקיימים על אמצעי תשלום  בלוקל סטורץ
    window.location.href = "/signin"; // שהדפדפן ינווט לדף"/signin"
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand>Store Web</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <NavDropdown title="Men" id="navbarScrollingDropdown">
                <NavDropdown.Item>
                  <Link className="link" to="/products/men/shirts">
                    {" "}
                    Shirts
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="link" to="/products/men/pants">
                    {" "}
                    Pants
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="link" to="/products/men/shoes">
                    {" "}
                    Shoes
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link className="link" to="/products/men">
                    {" "}
                    All Categories{" "}
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Women" id="navbarScrollingDropdown">
                <NavDropdown.Item>
                  <Link className="link" to="/products/women/shirts">
                    {" "}
                    Shirts
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="link" to="/products/women/pants">
                    {" "}
                    Pants
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="link" to="/products/women/shoes">
                    {" "}
                    Shoes
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link className="link" to="/products/women">
                    {" "}
                    All Categories{" "}
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav className="flex-wrap w-100 p-2">
              {categories.map((category) => (
                <Nav.Item key={category} style={{ margin: "10px" }}>
                  <Link className="link" to={`/search?category=${category}`}>
                    {category}
                  </Link>
                </Nav.Item>
              ))}
            </Nav>

            <Form className="d-flex" onSubmit={submitHandler}>
              <Form.Control
                type="search"
                id="query"
                name="query"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                variant="outline-success"
                type="submit"
                id="buttob-search"
              >
                Search
              </Button>
            </Form>
          </Navbar.Collapse>

          {/* נוובר לעגלת המוצרים */}
          <Nav className="me-auto">
            {userInfo?.isAdmin === false || !userInfo ? (
              <Link to="/cart" className="nav-link">
                Cart:
                {cart.cartItems.length > 0 && (
                  <Badge pill="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
            ) : (
              userInfo?.isAdmin === true && <span></span>
            )}
            {/** נוובר לרישום המשתמש */}
            {userInfo?.isAdmin === false ? (
              <NavDropdown title={userInfo?.username} drop="start" id="dropdown-button-drop-start">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signOutHendler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              !userInfo && (
                <Link className="nav-link" to="/signin">
                  Sign In
                </Link>
              )
            )}
            {/** נוובר שיוצג רק לאדמין */}
            {userInfo?.isAdmin && (
              <NavDropdown title="Admin" drop="start" id="dropdown-button-drop-start">
                <LinkContainer to="/admin/products">
                  <NavDropdown.Item>Add/Edit Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orders">
                  <NavDropdown.Item>View/Edit Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>View/Edit Users</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Admin Profile</NavDropdown.Item>
                </LinkContainer>
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signOutHendler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavHome;
