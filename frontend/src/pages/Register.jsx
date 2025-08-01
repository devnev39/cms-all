import { useFormik } from "formik";
import * as yup from "yup";
import { createUser } from "../services/user/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function Register() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
      roleId: 3,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name required !"),
      email: yup.string().email().required("Email required !"),
      password: yup.string().required("Password required !"),
      mobile: yup
        .string()
        .max(13)
        .min(10)
        .required("Valid phone number required !"),
    }),
    onSubmit: (values) => {
      createUser(values)
        .then((resp) => {
          if (resp) {
            toast.success("Signed up successfully !");
          }
          navigate("/login");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
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
                  Sign Up
                </h1>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Name
                    </label>
                    <input
                      className={
                        formik.touched.name && formik.errors.name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      id="name"
                      name="name"
                      {...formik.getFieldProps("name")}
                      autoComplete="name"
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
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
                      autoComplete="new-password"
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label fw-semibold">
                      Mobile
                    </label>
                    <input
                      type="number"
                      className={
                        formik.touched.mobile && formik.errors.mobile
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      id="mobile"
                      name="mobile"
                      {...formik.getFieldProps("mobile")}
                      autoComplete="tel"
                    />
                    {formik.touched.mobile && formik.errors.mobile ? (
                      <div className="invalid-feedback">
                        {formik.errors.mobile}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold shadow-sm"
                  >
                    Sign Up
                  </button>
                  <div className="text-center mt-4">
                    <span className="text-muted">
                      Already have an account?{" "}
                      <a href="/login" className="text-success fw-semibold">
                        Sign In
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

export default Register;
