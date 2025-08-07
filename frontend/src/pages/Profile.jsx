import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { toast } from "react-toastify";
import { resetPassword, updateUser } from "../services/user/user";
import { updateUser as updateUserRedux } from "../features/user/userSlice";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const token = sessionStorage.getItem("token");

  const dispatch = useDispatch();

  const userForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: user ? user.id : "",
      name: (user && user.name) || "",
      email: (user && user.email) || "",
      mobile: (user && user.mobile) || "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required!"),
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required!"),
      mobile: yup
        .string()
        .matches(/^\d{10,13}$/, "Phone number must be between 10 and 13 digits")
        .required("Phone number is required!"),
    }),
    onSubmit: (values) => {
      updateUser(values.id, values, token)
        .then((resp) => {
          if (resp.status === 200) {
            toast.success("Profile updated successfully!");
            dispatch(updateUserRedux(resp.data));
          }
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message || "Failed to update profile"
          );
        });
    },
  });

  const resetPasswordForm = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: yup.object({
      oldPassword: yup.string().required("Old password is required!"),
      newPassword: yup.string().required("New password is required!"),
    }),
    onSubmit: (values) => {
      // Handle password reset logic here
      resetPassword(user.id, values, token)
        .then((resp) => {
          if (resp.status === 200) {
            toast.success("Password reset successfully!");
            resetPasswordForm.resetForm();
          } else {
            toast.error("Failed to reset password");
          }
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message || "Failed to reset password"
          );
          resetPasswordForm.resetForm();
        });
    },
  });

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h2 className="text-center">Profile</h2>
            <hr />
            <form onSubmit={userForm.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Name
                </label>
                <input
                  className={
                    userForm.touched.name && userForm.errors.name
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="name"
                  name="name"
                  {...userForm.getFieldProps("name")}
                  autoComplete="name"
                />
                {userForm.touched.name && userForm.errors.name ? (
                  <div className="invalid-feedback">{userForm.errors.name}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  className={
                    userForm.touched.email && userForm.errors.email
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="email"
                  name="email"
                  {...userForm.getFieldProps("email")}
                  autoComplete="email"
                />
                {userForm.touched.email && userForm.errors.email ? (
                  <div className="invalid-feedback">
                    {userForm.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label fw-semibold">
                  Mobile
                </label>
                <input
                  className={
                    userForm.touched.mobile && userForm.errors.mobile
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="mobile"
                  name="mobile"
                  {...userForm.getFieldProps("mobile")}
                  autoComplete="mobile"
                />
                {userForm.touched.mobile && userForm.errors.mobile ? (
                  <div className="invalid-feedback">
                    {userForm.errors.mobile}
                  </div>
                ) : null}
              </div>
              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    JSON.stringify(userForm.values) ===
                    JSON.stringify({
                      id: user && user.id,
                      name: user && user.name,
                      email: user && user.email,
                      mobile: user && user.mobile,
                    })
                  }
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h2 className="text-center">Reset Password</h2>
            <hr />
            <form onSubmit={resetPasswordForm.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="oldPassword" className="form-label fw-semibold">
                  Old Password
                </label>
                <input
                  type="password"
                  className={
                    resetPasswordForm.touched.oldPassword &&
                    resetPasswordForm.errors.oldPassword
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="oldPassword"
                  name="oldPassword"
                  {...resetPasswordForm.getFieldProps("oldPassword")}
                  autoComplete="oldPassword"
                />
                {resetPasswordForm.touched.oldPassword &&
                resetPasswordForm.errors.oldPassword ? (
                  <div className="invalid-feedback">
                    {resetPasswordForm.errors.oldPassword}
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  className={
                    resetPasswordForm.touched.newPassword &&
                    resetPasswordForm.errors.newPassword
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="newPassword"
                  name="newPassword"
                  {...resetPasswordForm.getFieldProps("newPassword")}
                  autoComplete="newPassword"
                />
                {resetPasswordForm.touched.newPassword &&
                resetPasswordForm.errors.newPassword ? (
                  <div className="invalid-feedback">
                    {resetPasswordForm.errors.newPassword}
                  </div>
                ) : null}
              </div>
              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    !resetPasswordForm.values.oldPassword ||
                    !resetPasswordForm.values.newPassword ||
                    resetPasswordForm.values.oldPassword ===
                      resetPasswordForm.values.newPassword
                  }
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
