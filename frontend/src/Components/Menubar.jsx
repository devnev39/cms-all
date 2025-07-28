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
      className={`nav-item d-flex w-100 my-2 border rounded border-primary${
        currentPath === "/" + menu.url ? " active-list-item" : ""
      }`}
    >
      <NavLink className="nav-link active hover-highlight w-100" to={menu.url}>
        <div className="d-inline mx-2">{menu.icon}</div>
        <div className="d-inline">{menu.label}</div>
      </NavLink>
    </li>
  ));
};

function Menubar() {
  const user = useSelector((state) => state.user.user);
  return (
    <>
      <nav
        className="navbar navbar-expand-md bg-body-tertiary d-flex flex-column justify-content-center"
        style={{ height: "100vh" }}
      >
        {/* Add style for li hover highlight and active */}
        <style>{`
          .navbar-nav .nav-item:hover {
            background-color:rgb(227, 242, 253);
            transition: background 0.2s;
          }
          .logout-link:hover {
            background-color:rgb(253, 227, 227);
            transition: background 0.2s;
          }
          .active-list-item {
            background-color: #bbdefb !important;
            border-width: 2px;
            border-color: #1976d2 !important;
          }
        `}</style>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-start"
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
            <div className="offcanvas-body d-flex flex-column align-items-start justify-content-center">
              <ul className="navbar-nav justify-content-start flex-grow-1 pe-3 d-flex flex-column fs-4">
                {user && user?.role
                  ? renderMenuProps(
                      menuOptions[user.role.type],
                      location.pathname
                    )
                  : null}
                <li className="d-flex w-100 my-2 border rounded border-danger logout-link">
                  <a
                    className="nav-link active hover-highlight w-100"
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
      </nav>
    </>
  );
}

export default Menubar;
