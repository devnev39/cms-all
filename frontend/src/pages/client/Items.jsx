import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllItems,
  deleteItem,
  updateItem,
  createItem,
} from "../../services/user/items";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  setItems,
  updateItem as updateItemRedux,
  removeItem as removeItemRedux,
} from "../../features/user/itemSlice";
import { Field, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { getCatererByUserId } from "../../services/user/caterer";

const glassContainer = {
  background: "rgba(33,37,41,0.65)",
  borderRadius: "18px",
  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
  padding: "20px",
  color: "#fff",
};

const Items = () => {
  const [showModal, setShowModal] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  const fileRef = useRef(null);

  const [fileError, setFileError] = useState(null);
  const [cachedUri, setCachedUri] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const checkFileSize = (file) => {
    let valid = true;
    // const file = fileRef?.current?.file;
    console.log("File:", file);
    if (file) {
      const size = file.size / 1024 / 1024;
      if (size > 10) {
        valid = false;
      }
    }
    console.log("File size valid:", valid);
    return valid;
  };

  const checkFileType = (file) => {
    let valid = true;
    // const file = fileRef?.current?.file;
    console.log("File type:", file?.type);
    if (file) {
      const type = file.type.split("/")[1];
      const validTypes = ["svg+xml", "jpeg", "png", "jpg"];
      if (!validTypes.includes(type)) {
        valid = false;
      }
    }
    console.log("File type valid:", valid);
    return valid;
  };

  const createFormik = useFormik({
    initialValues: {
      name: "",
      price: "",
      isAvailable: false,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required!"),
      price: yup
        .number()
        .required("Price is required!")
        .min(0, "Price must be a positive number"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("catererId", catererId);
      formData.append("isAvailable", values.isAvailable);
      if (fileRef.current?.files[0]) {
        formData.append("file", fileRef.current.files[0]);
      }
      createItem(formData, token)
        .then((resp) => {
          toast.success("Item created successfully!");
          dispatch(setItems([...items, resp.data]));
          setShowModal(false);
          resetForm();
          setCachedUri(null);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Failed to create item");
        });
    },
  });

  const updateFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedItem?.name || "",
      price: selectedItem?.price || "",
      isAvailable: selectedItem?.isAvailable || false,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required!"),
      price: yup
        .number()
        .required("Price is required!")
        .min(0, "Price must be a positive number"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("id", selectedItem.id);
      formData.append("isAvailable", values.isAvailable);
      if (fileRef.current?.files[0]) {
        formData.append("file", fileRef.current.files[0]);
      }
      updateItem(formData, token)
        .then((resp) => {
          dispatch(updateItemRedux(resp.data));
          toast.success("Item updated!");
          setShowUpdateModal(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Update failed !");
        });
    },
  });

  const userId = user?.id;
  // find catererId from userId
  const [catererId, setCatererId] = useState(null);
  useEffect(() => {
    if (userId && token) {
      getCatererByUserId(userId, token)
        .then((res) => {
          console.log("res :", res.data);
          setCatererId(res.data.id);
          console.log("Caterer ID:", res.data.id);
        })
        .catch((err) => {
          console.error("Failed to fetch caterer ID:", err);
          toast.error("Failed to fetch caterer ID");
        });
    }
  }, [userId]);

  const items = useSelector((state) => state.item?.items || []);

  const fetchItems = () => {
    getAllItems(catererId, token)
      .then((res) => {
        console.log("Fetched items:", res.data);
        const filtered = res.data.filter(
          (item) => item.caterer?.id === catererId
        );
        console.log("Filtered items:", filtered);
        dispatch(setItems(filtered));
        console.log("Items set in Redux:", items);
      })
      .catch((err) => {
        toast.error("Failed to fetch items");
        console.error(err);
      });
  };

  useEffect(() => {
    if (token && catererId) {
      fetchItems();
    }
  }, [token, catererId]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    deleteItem(id, token)
      .then(() => {
        toast.success("Item deleted");
        dispatch(removeItemRedux({ id }));
      })
      .catch(() => toast.error("Delete failed"));
  };

  return (
    <div className="container py-4">
      <div style={glassContainer}>
        <div className="py-4 display-6 text-white">Your Items</div>
        <div className="table-responsive">
          <table className="table table-hover table-dark mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Image</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id || item._id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <img
                        src={item.imageUri || "https://via.placeholder.com/50"}
                        alt={item.name}
                        className="img-fluid"
                        style={{ width: "5vw" }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        defaultChecked={item.isAvailable}
                        className="form-check-input text-danger"
                        onChange={(event) => {
                          const formData = new FormData();
                          formData.append("id", item.id);
                          formData.append("isAvailable", event.target.checked);
                          updateItem(formData, token)
                            .then((resp) => {
                              dispatch(updateItemRedux(resp.data));
                              toast.success("Item updated!");
                              setShowUpdateModal(false);
                            })
                            .catch((err) => {
                              toast.error(
                                err?.response?.data?.message ||
                                  "Update failed !"
                              );
                            });
                        }}
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowUpdateModal(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center my-4">
          <button
            className="btn btn-outline-light"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Item
          </button>
        </div>

        {/* Create Modal */}
        {showModal && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: "rgba(0,0,0,0.3)", height: "70vh" }}
          >
            <div className="modal-dialog">
              <div className="modal-content bg-dark text-white">
                <div className="modal-header">
                  <h5 className="modal-title">Create Item</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <FormikProvider value={createFormik}>
                  <form onSubmit={createFormik.handleSubmit}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          className={
                            createFormik.touched.name &&
                            createFormik.errors.name
                              ? "form-control is-invalid bg-dark text-white"
                              : "form-control bg-dark text-white"
                          }
                          name="name"
                          {...createFormik.getFieldProps("name")}
                        />
                        {createFormik.touched.name &&
                        createFormik.errors.name ? (
                          <div className="invalid-feedback">
                            {createFormik.errors.name}
                          </div>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          className={
                            createFormik.touched.price &&
                            createFormik.errors.price
                              ? "form-control is-invalid bg-dark text-white"
                              : "form-control bg-dark text-white"
                          }
                          name="price"
                          {...createFormik.getFieldProps("price")}
                        />
                        {createFormik.touched.price &&
                        createFormik.errors.price ? (
                          <div className="invalid-feedback">
                            {createFormik.errors.price}
                          </div>
                        ) : null}
                      </div>
                      <div className="mb-3 form-check">
                        <Field
                          id="isAvailable"
                          type="checkbox"
                          className={
                            createFormik.touched.isAvailable &&
                            createFormik.errors.isAvailable
                              ? "form-check-input is-invalid bg-dark text-white"
                              : "form-check-input bg-dark text-white"
                          }
                          name="isAvailable"
                          // {...createFormik.getFieldProps("isAvailable")}
                        />
                        {createFormik.touched.isAvailable &&
                        createFormik.errors.isAvailable ? (
                          <div className="invalid-feedback">
                            {createFormik.errors.isAvailable}
                          </div>
                        ) : null}
                        <label
                          className="form-check-label"
                          htmlFor="isAvailable"
                        >
                          Available
                        </label>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="file">
                          Choose files
                        </label>{" "}
                        <input
                          className={
                            fileError
                              ? "form-control is-invalid bg-dark text-white"
                              : "form-control bg-dark text-white"
                          }
                          ref={fileRef}
                          type="file"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              if (!checkFileSize(file)) {
                                setFileError(
                                  "File size must be less than 10MB"
                                );
                              } else if (!checkFileType(file)) {
                                setFileError(
                                  "Invalid file type. Only images are allowed."
                                );
                              } else {
                                setFileError(null);
                                setCachedUri(URL.createObjectURL(file));
                              }
                            } else {
                              setFileError(null);
                            }
                          }}
                        />
                        {fileError && (
                          <div className="invalid-feedback">{fileError}</div>
                        )}
                        {cachedUri && (
                          <div className="d-flex justify-content-center mt-4">
                            <img
                              src={cachedUri}
                              alt="avatar"
                              style={{ width: "50%" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-outline-light">
                        Create
                      </button>
                    </div>
                  </form>
                </FormikProvider>
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
                  <h5 className="modal-title">Update Item</h5>
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
                      <label className="form-label">Price</label>
                      <input
                        className={
                          updateFormik.touched.price &&
                          updateFormik.errors.price
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="price"
                        {...updateFormik.getFieldProps("price")}
                      />
                      {updateFormik.touched.price &&
                      updateFormik.errors.price ? (
                        <div className="invalid-feedback">
                          {updateFormik.errors.price}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="file">
                        Choose files
                      </label>{" "}
                      <input
                        className={
                          fileError ? "form-control is-invalid" : "form-control"
                        }
                        ref={fileRef}
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file) {
                            if (!checkFileSize(file)) {
                              setFileError("File size must be less than 10MB");
                            } else if (!checkFileType(file)) {
                              setFileError(
                                "Invalid file type. Only images are allowed."
                              );
                            } else {
                              setFileError(null);
                              setCachedUri(URL.createObjectURL(file));
                            }
                          } else {
                            setFileError(null);
                          }
                        }}
                      />
                      {fileError && (
                        <div className="invalid-feedback">{fileError}</div>
                      )}
                      <div className="d-flex justify-content-center mt-4">
                        <img
                          src={
                            cachedUri != null
                              ? cachedUri
                              : selectedItem.imageUri
                          }
                          alt="avatar"
                          style={{ width: "50%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setShowUpdateModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-outline-light">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
