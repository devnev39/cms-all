import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Components/Layout";
import Landing from "./pages/Home/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ClientDashboard from "./pages/Dashboard/ClientDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared Layout with Navbar */}
        <Route path="/" element={<Layout />}>
          {/* This will be rendered at "/" */}
          <Route index element={<Landing />} />

          {/* Other nested pages */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="staff" element={<ClientDashboard />} />
          <Route path="customer" element={<CustomerDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
