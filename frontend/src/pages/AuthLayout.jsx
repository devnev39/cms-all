import React, { useEffect } from "react";
import { getAllUsers, getCurrentUser } from "../services/user/user";
import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUsers } from "../features/user/userSlice";
import Menubar from "../Components/Menubar";
import { getAllCagterers } from "../services/user/caterer";
import { setCaterers } from "../features/user/catererSlice";

function AuthLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const caterers = useSelector((state) => state.caterer?.caterers);
  useEffect(() => {
    if (!users) {
      const token = sessionStorage.getItem("token");
      if (token) {
        getAllUsers(token)
          .then((resp) => {
            dispatch(setUsers(resp.data));
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [users, dispatch]);
  useEffect(() => {
    if (!caterers) {
      const token = sessionStorage.getItem("token");
      if (token) {
        getAllCagterers(token)
          .then((resp) => {
            dispatch(setCaterers(resp.data));
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [caterers, dispatch]);

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
