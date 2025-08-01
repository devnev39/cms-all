import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../services/user/user";
import { setUser } from "../features/user/userSlice";
import { toast } from "react-toastify";

export function useCurrentUser() {
  const user = useSelector((state) => state.user.user);
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && token) {
      // Fetch the current user if not already set
      getCurrentUser(token)
        .then((resp) => {
          dispatch(setUser(resp.data));
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || "Failed to fetch user data"
          );
          sessionStorage.removeItem("token");
        });
    }
  }, [token]);
  return { user };
}
