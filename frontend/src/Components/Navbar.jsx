import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-warning shadow-sm">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold fs-3 text-dark" to="/">
          🍽️ Canteen CMS
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-dark" activeclassname="active" exact>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/menu" className="nav-link text-dark" activeclassname="active">
                Menu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/orders" className="nav-link text-dark" activeclassname="active">
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/payments" className="nav-link text-dark" activeclassname="active">
                Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin" className="nav-link text-dark" activeclassname="active">
                Admin Panel
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-dark"
                href="/#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 Account
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/settings">
                    Settings
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <NavLink className="dropdown-item text-danger" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
