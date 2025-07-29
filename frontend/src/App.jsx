import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Components/Layout";
import Landing from "./pages/Home/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./pages/AuthLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Clients from "./pages/Clients";
import Caterers from "./pages/Caterers";
import Items from "./pages/Items";
import CouponTypes from "./pages/CouponTypes";
import Coupons from "./pages/Coupons";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ClientDashboard from "./pages/Dashboard/ClientDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AuthLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="caterers" element={<Caterers />} />
          <Route path="items" element={<Items />} />
          <Route path="coupontypes" element={<CouponTypes />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={3000} closeButton />
    </BrowserRouter>
  );
}

export default App;
