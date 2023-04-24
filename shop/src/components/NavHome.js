import React, { useContext } from "react";
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
import { Link } from "react-router-dom";
import { Store } from "../Store";

const NavHome = (props) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

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
                <NavDropdown.Item><Link className="link" to='/products/men/shirts'> Shirts</Link></NavDropdown.Item>
                <NavDropdown.Item><Link className="link" to='/products/men/pants'> Pants</Link></NavDropdown.Item>
                <NavDropdown.Item><Link className="link" to='/products/men/shoes'> Shoes</Link></NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item><Link className="link" to='/products/men'> All Categories </Link></NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Women" id="navbarScrollingDropdown">
                <NavDropdown.Item>Short</NavDropdown.Item>
                <NavDropdown.Item>Pans</NavDropdown.Item>
                <NavDropdown.Item>Shoes</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item><Link className="link" to='/products/women'> All Categories </Link></NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
          {/* נוובר לעגלת המוצרים */}
          <Nav className="me-auto">
            <Link to="/cart" className="nav-link">
              Cart:
              {cart.cartItems.length > 0 && (
                <Badge pill="danger">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
                {/** נוובר לרישום המשתמש */}
            {userInfo ? (
              <NavDropdown title={userInfo?.username} id="basic-nav-dropdown">
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
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavHome;
