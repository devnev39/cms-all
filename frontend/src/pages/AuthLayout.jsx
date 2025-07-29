import React, { useEffect } from "react";
import { getCurrentUser } from "../services/user/user";
import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import Menubar from "../Components/Menubar";

function AuthLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    // Get the token
    const token = sessionStorage.getItem("token");

    // Fetch the current user
    if (token) {
      getCurrentUser(token)
        .then((resp) => {
          console.log(resp);
          dispatch(setUser(resp.data));
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message);
          sessionStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-2">
          <Menubar />
        </div>
        <div className="col-10">
          <div
            className="d-flex justify-content-center w-100 align-items-center"
            style={{ height: "70vh" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
