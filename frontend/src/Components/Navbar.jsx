import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/user/userSlice";

const menuOptions = {
  ROLE_ADMIN: [
    {
      label: "Clients",
      url: "clients",
    },
    {
      label: "Caterers",
      url: "caterers",
    },
  ],
  ROLE_CLNT: [
    {
      label: "Dashboard",
      url: "dashboard",
    },
    {
      label: "Items",
      url: "items",
    },
    {
      label: "Coupon Types",
      url: "coupontypes",
    },
    {
      label: "Coupons",
      url: "coupons",
    },
    {
      label: "Orders",
      url: "orders",
    },
  ],
  ROLE_CSTMR: [
    {
      label: "Menu",
      url: "menu",
    },
    {
      label: "Coupons",
      url: "coupons",
    },
    {
      label: "Cart",
      url: "cart",
    },
    {
      label: "Orders",
      url: "orders",
    },
  ],
};

const navbarItems = [
  {
    label: "Menu",
    url: "menu",
  },
  {
    label: "Login",
    url: "login",
  },
];

const renderNavOptions = (menuOptions, currentPath) => {
  return menuOptions.map((menu) => (
    <li className="nav-item" key={menu.url}>
      <NavLink
        to={menu.url}
        className={
          `nav-link text-white` +
          (currentPath.split("/")[1] === menu.url.toLowerCase()
            ? " text-decoration-underline fw-bold"
            : "")
        }
      >
        {menu.label}
      </NavLink>
    </li>
  ));
};

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm"
      style={{ fontFamily: "Segoe UI, Arial, sans-serif", color: "#fff" }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold fs-3 text-white" to="/">
          ServeEasy
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
              <NavLink
                to="/"
                className={
                  `nav-link text-white` +
                  (location.pathname === "/"
                    ? " text-decoration-underline fw-bold"
                    : "")
                }
                exact="true"
              >
                Home
              </NavLink>
            </li>
            {user && user.role
              ? renderNavOptions(menuOptions[user.role.type], location.pathname)
              : null}

            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="/#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Account
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
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
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          dispatch(setUser(null));
                          sessionStorage.removeItem("token");
                          navigate("/");
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>{renderNavOptions(navbarItems, location.pathname)}</>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
