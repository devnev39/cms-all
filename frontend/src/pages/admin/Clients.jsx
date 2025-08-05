import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsers,
  updateUser as updateUserRedux,
  removeUser,
} from "../../features/user/userSlice";
import {
  getAllUsers,
  updateUser as updateUserService,
  deleteUser,
  createUser,
} from "../../services/user/user";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Clients() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users) || [];
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!users || users.length === 0) {
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
  }, []);

  // Update User Formik
  const updateFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      mobile: selectedUser?.mobile || "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name required !"),
      email: yup.string().email().required("Email required !"),
      mobile: yup
        .string()
        .max(13)
        .min(10)
        .required("Valid phone number required !"),
    }),
    onSubmit: (values) => {
      const token = sessionStorage.getItem("token");
      if (token && selectedUser) {
        updateUserService(selectedUser.id, values, token)
          .then((resp) => {
            dispatch(updateUserRedux(resp.data));
            toast.success("User updated!");
            setShowUpdateModal(false);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || "Update failed");
          });
      }
    },
  });

  // Create User Formik
  const createFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
      roleId: 2,
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
    onSubmit: (values, { resetForm }) => {
      createUser(values)
        .then(() => {
          toast.success("Client created!");
          setShowCreateModal(false);
          resetForm();
          // Refetch users
          const token = sessionStorage.getItem("token");
          if (token) {
            getAllUsers(token).then((resp) => dispatch(setUsers(resp.data)));
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Create failed");
        });
    },
  });

  // Delete user
  const handleDelete = (userId) => {
    const token = sessionStorage.getItem("token");
    if (
      token &&
      window.confirm("Are you sure you want to delete this client?")
    ) {
      deleteUser(userId, token)
        .then(() => {
          dispatch(removeUser({ id: userId }));
          toast.success("Client deleted!");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Delete failed");
        });
    }
  };

  return (
    <div className="container">
      <div className="py-4 display-6 text-white">Clients</div>
      <div className="table-responsive rounded border p-2 shadow bg-white">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-success text-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUpdateModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="me-2" /> Create Client
        </button>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Client</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <form onSubmit={updateFormik.handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className={
                        updateFormik.touched.name && updateFormik.errors.name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="name"
                      {...updateFormik.getFieldProps("name")}
                    />
                    {updateFormik.touched.name && updateFormik.errors.name ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className={
                        updateFormik.touched.email && updateFormik.errors.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="email"
                      {...updateFormik.getFieldProps("email")}
                    />
                    {updateFormik.touched.email && updateFormik.errors.email ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                      className={
                        updateFormik.touched.mobile &&
                        updateFormik.errors.mobile
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="mobile"
                      {...updateFormik.getFieldProps("mobile")}
                    />
                    {updateFormik.touched.mobile &&
                    updateFormik.errors.mobile ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.mobile}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Client</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={createFormik.handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className={
                        createFormik.touched.name && createFormik.errors.name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="name"
                      {...createFormik.getFieldProps("name")}
                    />
                    {createFormik.touched.name && createFormik.errors.name ? (
                      <div className="invalid-feedback">
                        {createFormik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className={
                        createFormik.touched.email && createFormik.errors.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="email"
                      {...createFormik.getFieldProps("email")}
                    />
                    {createFormik.touched.email && createFormik.errors.email ? (
                      <div className="invalid-feedback">
                        {createFormik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className={
                        createFormik.touched.password &&
                        createFormik.errors.password
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="password"
                      {...createFormik.getFieldProps("password")}
                    />
                    {createFormik.touched.password &&
                    createFormik.errors.password ? (
                      <div className="invalid-feedback">
                        {createFormik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                      className={
                        createFormik.touched.mobile &&
                        createFormik.errors.mobile
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="mobile"
                      {...createFormik.getFieldProps("mobile")}
                    />
                    {createFormik.touched.mobile &&
                    createFormik.errors.mobile ? (
                      <div className="invalid-feedback">
                        {createFormik.errors.mobile}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
