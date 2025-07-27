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
        <Route path="/" element={<Layout />} />
        <Route path="/" Component={<Landing />} />
        <Route path="/login" Component={<Login />} />
        <Route path="/register" Component={<Register />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="staff" element={<ClientDashboard />} />
        <Route path="customer" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
