import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCaterer,
  removeCaterer,
  addCaterer,
  setCaterers,
} from "../../features/user/catererSlice";
import {
  createCaterer,
  updateCaterer as updateCatererService,
  deleteCaterer,
  getAllCaterers,
} from "../../services/user/caterer";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

function Caterers() {
  const dispatch = useDispatch();
  const caterers = useSelector((state) => state.caterer?.caterers);
  const clients = useSelector((state) => state.user?.users) || [];
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCaterer, setSelectedCaterer] = useState(null);
  useEffect(() => {
    if (!caterers) {
      const token = sessionStorage.getItem("token");
      if (token) {
        getAllCaterers(token)
          .then((resp) => {
            dispatch(setCaterers(resp.data));
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      razorpay_key: "",
      razorpay_secret: "",
      userId: "",
    },
    validationSchema: yup.object({
      name: yup.string().max(50, "Max 50 chars").required("Name required"),
      razorpay_key: yup
        .string()
        .max(50, "Max 50 chars")
        .required("Key required"),
      razorpay_secret: yup
        .string()
        .max(50, "Max 50 chars")
        .required("Secret required"),
      userId: yup.string().required("Client required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        createCaterer(values, token)
          .then((resp) => {
            setShowModal(false);
            resetForm();
            toast.success("Caterer created successfully");
            dispatch(addCaterer({ ...resp.data }));
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || "Create failed");
          });
      }
    },
  });

  // Update Caterer Formik
  const updateFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedCaterer?.name || "",
      razorpay_key: selectedCaterer?.razorpay_key || "",
      razorpay_secret: selectedCaterer?.razorpay_secret || "",
      userId: selectedCaterer?.user.id || "",
    },
    validationSchema: yup.object({
      name: yup.string().max(50, "Max 50 chars").required("Name required"),
      razorpay_key: yup
        .string()
        .max(50, "Max 50 chars")
        .required("Key required"),
      razorpay_secret: yup
        .string()
        .max(50, "Max 50 chars")
        .required("Secret required"),
      userId: yup.string().required("Client required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const token = sessionStorage.getItem("token");
      if (token && selectedCaterer) {
        updateCatererService(selectedCaterer.id, values, token)
          .then((resp) => {
            dispatch(updateCaterer({ ...resp.data }));
            setShowUpdateModal(false);
            resetForm();
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || "Update failed");
          });
      }
    },
  });

  // Delete caterer
  const handleDelete = (catererId) => {
    const token = sessionStorage.getItem("token");
    if (
      token &&
      window.confirm("Are you sure you want to delete this caterer?")
    ) {
      // You should implement deleteCaterer service and call dispatch(removeCaterer)
      // ...existing code for delete...
      deleteCaterer(catererId, token)
        .then(() => {
          dispatch(removeCaterer({ id: catererId }));
          toast.success("Caterer deleted successfully");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Delete failed");
        });
    }
  };

  return (
    <div className="container">
      <div className="py-4 display-6 text-white">Caterers</div>
      <div className="table-responsive rounded border p-2 shadow bg-white">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-success text-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Client Name</th>
              <th>Client Email</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(caterers) && caterers.length > 0 ? (
              caterers.map((caterer) => (
                <tr key={caterer.id}>
                  <td>{caterer.id}</td>
                  <td>{caterer.name}</td>
                  <td>{caterer.user.name}</td>
                  <td>{caterer.user.email}</td>
                  <td>
                    {caterer.createdAt
                      ? new Date(caterer.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setSelectedCaterer(caterer);
                        setShowUpdateModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(caterer.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No caterers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center my-4">
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Create Caterer
        </button>
      </div>
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Caterer</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className={
                        formik.touched.name && formik.errors.name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="name"
                      maxLength={50}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Razor Pay Key</label>
                    <input
                      className={
                        formik.touched.razorpay_key &&
                        formik.errors.razorpay_key
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="razorpay_key"
                      maxLength={50}
                      {...formik.getFieldProps("razorpay_key")}
                    />
                    {formik.touched.razorpay_key &&
                    formik.errors.razorpay_key ? (
                      <div className="invalid-feedback">
                        {formik.errors.razorpay_key}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Razor Pay Secret</label>
                    <input
                      className={
                        formik.touched.razorpay_secret &&
                        formik.errors.razorpay_secret
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="razorpay_secret"
                      maxLength={50}
                      {...formik.getFieldProps("razorpay_secret")}
                    />
                    {formik.touched.razorpay_secret &&
                    formik.errors.razorpay_secret ? (
                      <div className="invalid-feedback">
                        {formik.errors.razorpay_secret}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Client</label>
                    <select
                      className={
                        formik.touched.userId && formik.errors.userId
                          ? "form-select is-invalid"
                          : "form-select"
                      }
                      name="userId"
                      {...formik.getFieldProps("userId")}
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} ({client.email})
                        </option>
                      ))}
                    </select>
                    {formik.touched.userId && formik.errors.userId ? (
                      <div className="invalid-feedback">
                        {formik.errors.userId}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
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
                <h5 className="modal-title">Update Caterer</h5>
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
                      maxLength={50}
                      {...updateFormik.getFieldProps("name")}
                    />
                    {updateFormik.touched.name && updateFormik.errors.name ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Razor Pay Key</label>
                    <input
                      className={
                        updateFormik.touched.razorpay_key &&
                        updateFormik.errors.razorpay_key
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="razorpay_key"
                      maxLength={50}
                      {...updateFormik.getFieldProps("razorpay_key")}
                    />
                    {updateFormik.touched.razorpay_key &&
                    updateFormik.errors.razorpay_key ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.razorpay_key}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Razor Pay Secret</label>
                    <input
                      className={
                        updateFormik.touched.razorpay_secret &&
                        updateFormik.errors.razorpay_secret
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="razorpay_secret"
                      maxLength={50}
                      {...updateFormik.getFieldProps("razorpay_secret")}
                    />
                    {updateFormik.touched.razorpay_secret &&
                    updateFormik.errors.razorpay_secret ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.razorpay_secret}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Client</label>
                    <select
                      className={
                        updateFormik.touched.userId &&
                        updateFormik.errors.userId
                          ? "form-select is-invalid"
                          : "form-select"
                      }
                      name="userId"
                      {...updateFormik.getFieldProps("userId")}
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} ({client.email})
                        </option>
                      ))}
                    </select>
                    {updateFormik.touched.userId &&
                    updateFormik.errors.userId ? (
                      <div className="invalid-feedback">
                        {updateFormik.errors.userId}
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
    </div>
  );
}

export default Caterers;
