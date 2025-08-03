import React, { useEffect } from "react";
import { getCurrentUser } from "../services/user/user";
import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/user/userSlice";
import Menubar from "../Components/Menubar";

function AuthLayout() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    // Get the token
    const token = sessionStorage.getItem("token");

    // Fetch the current user
    if (token && !user) {
      getCurrentUser(token)
        .then((resp) => {
          dispatch(setUser(resp.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          sessionStorage.removeItem("token");
          navigate("/login");
        });
    } else if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      {/* <div className="row">
        <div className="col-2">
          <Menubar />
        </div>
        <div className="col-10">
          <div
            className="d-flex justify-content-center w-100 align-items-center"
            style={{ height: "70vh" }}
          > */}
      <Outlet />
      {/* </div>
        </div>
      </div> */}
    </>
  );
}

export default AuthLayout;
