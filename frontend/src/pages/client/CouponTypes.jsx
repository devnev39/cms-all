import React, { useEffect, useState } from "react";
import {
  getAllCouponTypes,
  createCouponType,
  updateCouponType,
  deleteCouponType,
} from "../../services/user/couponType";
import { Modal, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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

const CouponTypes = () => {
  const token = sessionStorage.getItem("token");
  const [couponTypes, setCouponTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    minCount: "",
    originalPrice: "",
    discountPerCoupon: "",
  });
  const [editData, setEditData] = useState(null);
  const [catererId, setCatererId] = useState(null);

  const fetchCouponTypes = () => {
    getAllCouponTypes(token)
      .then((res) => {
        setCouponTypes(res.data);
      })
      .catch((err) => {
        toast.error("Failed to fetch coupon types");
        console.error(err);
      });
  };

  useEffect(() => {
    fetchCouponTypes();
    // TODO: fetch catererId if needed from logged-in user context
    setCatererId(1); // hardcoded or fetched from user state
  }, []);

  const handleCreate = () => {
    const payload = {
      ...formData,
      catererId,
    };
    createCouponType(payload, token)
      .then(() => {
        toast.success("Coupon type created");
        setShowModal(false);
        fetchCouponTypes();
      })
      .catch(() => toast.error("Create failed"));
  };

  const handleUpdate = () => {
    const payload = {
      id: editData.id,
      ...formData,
      catererId,
    };
    updateCouponType(payload, token)
      .then(() => {
        toast.success("Coupon type updated");
        setShowModal(false);
        setEditData(null);
        fetchCouponTypes();
      })
      .catch(() => toast.error("Update failed"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete this coupon type?")) return;
    deleteCouponType(id, token)
      .then(() => {
        toast.success("Deleted successfully");
        fetchCouponTypes();
      })
      .catch(() => toast.error("Delete failed"));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (data) => {
    setEditData(data);
    setFormData({
      type: data.type,
      minCount: data.minCount,
      originalPrice: data.originalPrice,
      discountPerCoupon: data.discountPerCoupon,
    });
    setShowModal(true);
  };

  return (
    <div className="container py-4">
      <div style={glassContainer}>
        <div className="py-4 display-6 text-white">Coupon Types</div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>Id</th>
                <th>Type</th>
                <th>Min Count</th>
                <th>Original Price (₹)</th>
                <th>Discount/Coupon (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {couponTypes.length > 0 ? (
                couponTypes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.type}</td>
                    <td>{c.minCount}</td>
                    <td>₹ {c.originalPrice}</td>
                    <td>₹ {c.discountPerCoupon}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditModal(c)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c.id)}
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
                    No coupon types found.
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
              setFormData({
                type: "",
                minCount: "",
                originalPrice: "",
                discountPerCoupon: "",
              });
              setEditData(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Coupon Type
          </button>
        </div>

        {/* Modal */}
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
                  <h5 className="modal-title">
                    {editData ? "Edit" : "Add"} Coupon Type
                  </h5>
                  <button
                    className="btn-close btn-close-light"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label" htmlFor="typeInp">
                    Type
                  </label>
                  <input
                    id="typeInp"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-control mb-2 bg-dark text-white"
                  />
                  <label className="form-label" htmlFor="minCountInp">
                    Minimun Coupon Count
                  </label>
                  <input
                    id="minCountInp"
                    name="minCount"
                    placeholder="Min Count"
                    type="number"
                    value={formData.minCount}
                    onChange={handleInputChange}
                    className="form-control mb-2 bg-dark text-white"
                  />
                  <label className="form-label" htmlFor="orgPriceInp">
                    Original Price
                  </label>
                  <input
                    id="orgPriceInp"
                    name="originalPrice"
                    placeholder="Original Price"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="form-control mb-2 bg-dark text-white"
                  />
                  <label className="form-label" htmlFor="disPerCpnInp">
                    Discount Per Coupon
                  </label>
                  <input
                    id="disPerCpnInp"
                    name="discountPerCoupon"
                    placeholder="Discount Per Coupon"
                    type="number"
                    value={formData.discountPerCoupon}
                    onChange={handleInputChange}
                    className="form-control bg-dark text-white"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={editData ? handleUpdate : handleCreate}
                  >
                    {editData ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponTypes;
