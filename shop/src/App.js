import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import ProductScreen from "./screen/ProductScreen";
//bootstrap
import { Container } from "react-bootstrap";
import NavHome from "./components/NavHome";
import CartScreen from "./screen/CartScreen";
import SinginScreen from "./screen/SinginScreen";
import ShippingAddressScreen from "./screen/ShippingAddressScreen";
import SignupScreen from "./screen/SignupScreen";
import PaymentMethodScreen from "./screen/PaymentMethodScreen";
import PlaceOrderScreen from "./screen/PlaceOrderScreen";
import MenProducts from "./screen/MenProducts";
import WomenProducts from "./screen/WomenProductScreen";
import MenShirtProducts from "./screen/MenShortScreen";


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
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SinginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/products/men" element={<MenProducts />} />
              <Route path="/products/men/shirt" element={<MenShirtProducts />} />
              <Route path="/products/women" element={<WomenProducts />} />
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
