import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import ProductScreen from "./screen/ProductScreen";
//bootstrap
import { Container } from "react-bootstrap";
import NavHome from "./components/NavHome";
import CartScreen from "./screen/CartScreen";
import SinginScreen from "./screen/SinginScreen";

function App() {
  return (
    <BrowserRouter>
      <div className="flex-colum site-container">
        <header className="App-header">
          <NavHome />
        </header>
        <main>
          <Container>
            {/* for single app apliccation  we use Routes*/}
            <Routes>
              <Route path="products/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SinginScreen/>} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer className="footer">
          <div>all rights reserved to amir samoha @2023 </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
