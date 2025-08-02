import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  MdMenu,
  MdAccountCircle,
  MdAddBusiness,
  MdFastfood,
  MdDashboard,
  MdOutlineBookmarkRemove,
  MdOutlineBookmark,
  MdLogout,
} from "react-icons/md";
import { Link, NavLink } from "react-router";
import { FaBars, FaHamburger } from "react-icons/fa";

const menuOptions = {
  ROLE_ADMIN: [
    {
      label: "Dashboard",
      icon: <MdDashboard />,
      url: "dashboard",
    },
    {
      label: "Clients",
      icon: <MdAccountCircle />,
      url: "clients",
    },
    {
      label: "Caterers",
      icon: <MdAddBusiness />,
      url: "caterers",
    },
  ],
  ROLE_CLNT: [
    {
      label: "Dashboard",
      icon: <MdDashboard />,
      url: "dashboard",
    },
    {
      label: "Items",
      icon: <MdFastfood />,
      url: "items",
    },
    {
      label: "Coupon Types",
      icon: <MdOutlineBookmarkRemove />,
      url: "coupontypes",
    },
    {
      label: "Coupons",
      icon: <MdOutlineBookmark />,
      url: "coupons",
    },
  ],
};

const renderMenuProps = (menuOptions, currentPath) => {
  return menuOptions.map((menu) => (
    <li
      className={`nav-item d-flex w-100 my-2${
        currentPath === "/" + menu.url ? " active-list-item" : ""
      }`}
    >
      <NavLink
        className="nav-link active hover-highlight text-white w-100"
        to={menu.url}
      >
        <div className="d-inline mx-2">{menu.icon}</div>
        <div className="d-inline">{menu.label}</div>
      </NavLink>
    </li>
  ));
};

function Menubar() {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  return (
    <>
      <nav
        className="navbar navbar-expand-md d-flex flex-column justify-content-center"
        style={{
          height: "100vh",
          background: "rgba(255,255,255,0.10)", // transparent white with small opacity
          fontFamily: "Segoe UI, Arial, sans-serif",
          color: "#fff",
        }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <FaBars style={{ color: "#fff" }} />
          </button>
          <div
            className="offcanvas offcanvas-start bg-transparent"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Canteen Management
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body bg-transparent d-flex flex-column align-items-center justify-content-center">
              <ul className="navbar-nav justify-content-center flex-grow-1 pe-3 d-flex flex-column fs-4">
                {user && user?.role
                  ? renderMenuProps(
                      menuOptions[user.role.type],
                      location.pathname
                    )
                  : null}
                <li className="d-flex w-100 my-2 logout-link">
                  <a
                    className="nav-link active hover-highlight w-100 text-danger"
                    aria-current="page"
                    href={"/login"}
                    onClick={() => {
                      sessionStorage.removeItem("token");
                    }}
                  >
                    <div className="d-inline mx-2">
                      <MdLogout />
                    </div>
                    <div className="d-inline">Logout</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <style>{`
          .navbar-nav .nav-item {
            color: #fff;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 1.15rem;
            letter-spacing: 0.5px;
            border-radius: 10px;
            transition: background 0.2s, color 0.2s;
          }
          .navbar-nav .nav-item .nav-link {
            color: #fff !important;
            font-weight: 500;
            opacity: 0.95;
          }
          .navbar-nav .nav-item:hover {
            background: rgba(33, 37, 41, 0.25);
            color: #4caf50 !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            transform: scale(1.03);
          }
          .navbar-nav .nav-item:hover .nav-link {
            color: #4caf50 !important;
          }
          .logout-link:hover {
            background-color:rgba(253, 227, 227, 0.7);
            transition: background 0.2s;
          }
          .active-list-item {
            background-color:rgba(190, 251, 187, 0.2) !important;
            border-width: 2px;
            border-color: #1976d2 !important;
            color: #1976d2 !important;
          }
        `}</style>
      </nav>
    </>
  );
}

export default Menubar;
