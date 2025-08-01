import { BrowserRouter, Route, Routes } from "react-router";
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
import BackgroundLayout from "./components/BackgroundLayout";
import NavbarLayout from "./components/NavbarLayout";
import UserLayout from "./components/UserLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route element={<NavbarLayout />}>
            <Route element={<BackgroundLayout />}>
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
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={3000} closeButton />
    </BrowserRouter>
  );
}

export default App;
