import React, { useEffect, useState } from 'react';
import {
  getAllCouponTypes,
  createCouponType,
  updateCouponType,
  deleteCouponType
} from '../../services/user/couponType';
import { Modal, Button, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CouponTypes = () => {
  const token = sessionStorage.getItem('token');
  const [couponTypes, setCouponTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    minCount: '',
    originalPrice: '',
    discountPerCoupon: ''
  });
  const [editData, setEditData] = useState(null);
  const [catererId, setCatererId] = useState(null);

  const fetchCouponTypes = () => {
    getAllCouponTypes(token)
      .then(res => {
        setCouponTypes(res.data);
      })
      .catch(err => {
        toast.error('Failed to fetch coupon types');
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
      catererId
    };
    createCouponType(payload, token)
      .then(() => {
        toast.success('Coupon type created');
        setShowModal(false);
        fetchCouponTypes();
      })
      .catch(() => toast.error('Create failed'));
  };

  const handleUpdate = () => {
    const payload = {
      id: editData.id,
      ...formData,
      catererId
    };
    updateCouponType(payload, token)
      .then(() => {
        toast.success('Coupon type updated');
        setShowModal(false);
        setEditData(null);
        fetchCouponTypes();
      })
      .catch(() => toast.error('Update failed'));
  };

  const handleDelete = id => {
    if (!window.confirm('Are you sure to delete this coupon type?')) return;
    deleteCouponType(id, token)
      .then(() => {
        toast.success('Deleted successfully');
        fetchCouponTypes();
      })
      .catch(() => toast.error('Delete failed'));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = data => {
    setEditData(data);
    setFormData({
      type: data.type,
      minCount: data.minCount,
      originalPrice: data.originalPrice,
      discountPerCoupon: data.discountPerCoupon
    });
    setShowModal(true);
  };

  return (
    <div className="container py-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Coupon Types</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setFormData({
              type: '',
              minCount: '',
              originalPrice: '',
              discountPerCoupon: ''
            });
            setEditData(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" /> Add Coupon Type
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow p-3 mx-auto" style={{ maxWidth: '900px' }}>
        <Table bordered hover className="mb-0">
          <thead className="table-success text-dark">
            <tr>
              <th>Type</th>
              <th>Min Count</th>
              <th>Original Price</th>
              <th>Discount/Coupon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {couponTypes.length > 0 ? (
              couponTypes.map(c => (
                <tr key={c.id}>
                  <td>{c.type}</td>
                  <td>{c.minCount}</td>
                  <td>{c.originalPrice}</td>
                  <td>{c.discountPerCoupon}</td>
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
              <tr><td colSpan="5" className="text-center">No coupon types found.</td></tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editData ? 'Edit' : 'Add'} Coupon Type</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  name="type"
                  placeholder="Type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  name="minCount"
                  placeholder="Min Count"
                  type="number"
                  value={formData.minCount}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  name="originalPrice"
                  placeholder="Original Price"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  name="discountPerCoupon"
                  placeholder="Discount Per Coupon"
                  type="number"
                  value={formData.discountPerCoupon}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={editData ? handleUpdate : handleCreate}>
                  {editData ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponTypes;
