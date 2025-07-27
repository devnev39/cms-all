import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/Home/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={<Landing />} />
        <Route path="/login" Component={<Login />} />
        <Route path="/register" Component={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
