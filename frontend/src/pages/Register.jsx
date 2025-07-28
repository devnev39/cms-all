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
      roleId: 4,
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
                <h1 className="display-6 text-center">SignIn</h1>
                <hr />
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">
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
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  ) : null}
                </div>
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
                <div className="mb-3">
                  <label htmlFor="mobileInput" className="form-label">
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
                  />
                  {formik.touched.mobile && formik.errors.mobile ? (
                    <div className="invalid-feedback">
                      {formik.errors.mobile}
                    </div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <button type="submit" className="btn btn-success w-100">
                    SignIn
                  </button>
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <div id="emailHelp" className="form-text">
                    Already have an account ? <a href="/login">SignIn.</a>
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

export default Register;
