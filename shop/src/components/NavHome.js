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

/* <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
              <Navbar.Brand>Web store</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar> */

const NavHome = (props) => {
  const {state} = useContext(Store);
  const {cart } = state;
  
  return (
    <div>
      <Navbar bg="light" expand="lg" >
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
                <NavDropdown.Item>Short</NavDropdown.Item>
                <NavDropdown.Item>Pans</NavDropdown.Item>
                <NavDropdown.Item>Shoes</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>All Categories</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Women" id="navbarScrollingDropdown">
                <NavDropdown.Item>Short</NavDropdown.Item>
                <NavDropdown.Item>Pans</NavDropdown.Item>
                <NavDropdown.Item>Shoes</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>All Categories</NavDropdown.Item>
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
            {cart.cartItems.length > 0 &&
            (<Badge pill="danger">
              {cart.cartItems.reduce((a,c) => a + c.quantity, 0)}
            </Badge>)}
            </Link>
          </Nav>


        </Container>
      </Navbar>
    </div>
  );
};

export default NavHome;
