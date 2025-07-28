import { useFormik } from "formik";
import * as yup from "yup";
import { login } from "../services/user/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to dashboard if token exists in session storage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Check if token exists in session storage
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Required !"),
      password: yup.string().required("Required !"),
    }),
    onSubmit: (values) => {
      login(values)
        .then((resp) => {
          toast.success("Logged in !");
          // Set the token in session storage
          sessionStorage.setItem("token", resp.data?.token);
          // set the user
          dispatch(setUser(resp.data?.user));

          navigate("/dashboard");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    },
  });
  return (
    <>
      <div
        className="d-flex w-100 justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="row w-100">
          <div className="col-4"></div>
          <div className="col-md-4">
            <div className="container border border-3 rounded p-5 w-100">
              <form onSubmit={formik.handleSubmit}>
                <h1 className="display-6 text-center">Login</h1>
                <hr />
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={
                      formik.touched.email && formik.errors.email
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="email"
                    name="email"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={
                      formik.touched.password && formik.errors.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="password"
                    name="password"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Check me out
                  </label>
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <button type="submit" className="btn btn-success w-100">
                    Login
                  </button>
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <div id="emailHelp" className="form-text">
                    Don't have an account ? <a href="/register">SignUp.</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
