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

          if (sessionStorage.getItem("redirect")) {
            navigate(JSON.parse(sessionStorage.getItem("redirect")).to);
          } else {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    },
  });
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 p-4">
              <div className="card-body">
                <h1 className="text-center fw-bold mb-4 text-success-emphasis">
                  Login
                </h1>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
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
                      autoComplete="username"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
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
                      autoComplete="current-password"
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
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold shadow-sm"
                  >
                    Login
                  </button>
                  <div className="text-center mt-4">
                    <span className="text-muted">
                      Don't have an account?{" "}
                      <a href="/register" className="text-success fw-semibold">
                        Sign Up
                      </a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
            <div className="text-center mt-3">
              <a href="/" className="btn btn-link text-white fw-bold">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
