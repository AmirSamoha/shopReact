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
import MenProducts from "./screen/Men_categories/MenProducts";
import WomenProducts from "./screen/Women_categories/WomenProductScreen";
import MenShirtProducts from "./screen/Men_categories/MenShirtScreen";
import MenPantsScreen from "./screen/Men_categories/MenPantsScreen";
import MenShoesScreen from "./screen/Men_categories/MenShoesScreen";
import OrderScreen from "./screen/OrderScreen";
import WomenPantsProducts from "./screen/Women_categories/WomenPantsScreen";
import WomenShirtProducts from "./screen/Women_categories/WomenShirtScreen";
import WomenShoesProducts from "./screen/Women_categories/WomenShoesScreen";
import OrderHistoryScreen from "./screen/OrderHistoryScreen";
import ProfileScreen from "./screen/ProfileScreen";
import ResetpasswordScreen from "./screen/ResetpasswordScreen";
import SearchScreen from "./screen/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screen/ProductListScreen";
import ProductEditScreen from "./screen/ProductEditScreen";
import OrderListScreen from "./screen/OrderListScreen";


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
              <Route path="/orderhistory" element={<ProtectedRoute> <OrderHistoryScreen /> </ProtectedRoute>} />
              <Route path="/products/men" element={<MenProducts />} />
              <Route path="/products/men/shirts" element={<MenShirtProducts />} />
              <Route path="/products/men/pants" element={<MenPantsScreen />} />
              <Route path="/products/men/shoes" element={<MenShoesScreen />} />
              <Route path="/products/women" element={<WomenProducts />} />
              <Route path="/products/women/pants" element={<WomenPantsProducts />} />
              <Route path="/products/women/shirts" element={<WomenShirtProducts />} />
              <Route path="/products/women/shoes" element={<WomenShoesProducts />} />
              <Route path="/order/:id" element={<ProtectedRoute> <OrderScreen /> </ProtectedRoute> } /> 
              <Route path="/profile" element={<ProtectedRoute> <ProfileScreen /> </ProtectedRoute> } />
              <Route path="/admin/products" element={<AdminRoute> <ProductListScreen /></AdminRoute>} />
              <Route path="/admin/product/:id" element={<AdminRoute> <ProductEditScreen /> </AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute> <OrderListScreen /> </AdminRoute>} />
              <Route path="/reset-password" element={<ResetpasswordScreen />} />
              <Route path="/search" element={<SearchScreen />} />
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
