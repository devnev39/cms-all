import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/Home/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./pages/AuthLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Clients from "./pages/admin/Clients";
import Caterers from "./pages/admin/Caterers";
import Profile from "./pages/Profile";
import Items from "./pages/client/Items";
import CouponTypes from "./pages/client/CouponTypes";
import Coupons from "./pages/client/Coupons";
import BackgroundLayout from "./components/BackgroundLayout";
import NavbarLayout from "./components/NavbarLayout";
import UserLayout from "./components/UserLayout";
import Menu from "./pages/menu/Menu";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route element={<UserLayout />}> */}
        <Route element={<NavbarLayout />}>
          <Route element={<BackgroundLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="menu" element={<Menu />} />
            <Route element={<AuthLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="clients" element={<Clients />} />
              <Route path="caterers" element={<Caterers />} />
              <Route path="items" element={<Items />} />
              <Route path="coupontypes" element={<CouponTypes />} />
              <Route path="coupons" element={<Coupons />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        {/* </Route> */}
      </Routes>
      <ToastContainer autoClose={3000} closeButton position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
