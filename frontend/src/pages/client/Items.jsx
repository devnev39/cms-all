import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllItems,
  deleteItem,
  updateItem,
  createItem
} from '../../services/user/items';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  setItems,
  setItem,
  updateItem as updateItemRedux,
  removeItem as removeItemRedux
} from '../../features/user/itemSlice';

const Items = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '' });

  const token = sessionStorage.getItem('token');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.user);
  const catererId = user?.id;
  const items = useSelector(state => state.item?.items || []);
  const selectedItem = useSelector(state => state.item?.item);

  const fetchItems = () => {
    getAllItems(catererId, token)
      .then(res => {
        const filtered = res.data.filter(item => item.catererId === catererId);
        dispatch(setItems(filtered));
      })
      .catch(err => {
        toast.error('Failed to fetch items');
        console.error(err);
      });
  };

  useEffect(() => {
    if (token && catererId) {
      fetchItems();
    }
  }, [token, catererId]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    if (!formData.name || !formData.price) return toast.error('All fields required');
    const newItem = { ...formData, catererId };
    createItem(catererId, newItem, token)
      .then(() => {
        toast.success('Item created');
        setShowModal(false);
        fetchItems();
      })
      .catch(() => toast.error('Create failed'));
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.price) return toast.error('All fields required');
    updateItem({ id: selectedItem.id, ...formData }, token)
      .then(res => {
        toast.success('Item updated');
        dispatch(updateItemRedux(res.data));
        setShowUpdateModal(false);
        dispatch(setItem(null));
      })
      .catch(() => toast.error('Update failed'));
  };

  const handleDelete = id => {
    if (!window.confirm('Are you sure to delete this item?')) return;
    deleteItem(id, token)
      .then(() => {
        toast.success('Item deleted');
        dispatch(removeItemRedux({ id }));
      })
      .catch(() => toast.error('Delete failed'));
  };

  return (
    <div className="container py-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Your Items</h2>
        <button className="btn btn-success" onClick={() => {
          setFormData({ name: '', price: '' });
          setShowModal(true);
        }}>
          <FaPlus className="me-2" /> Add Item
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow p-3 mx-auto" style={{ maxWidth: '900px' }}>
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-success text-dark">
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map(item => (
                <tr key={item.id || item._id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          dispatch(setItem(item));
                          setFormData({ name: item.name, price: item.price });
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
              <tr><td colSpan="3" className="text-center">No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <Modal
          title="Add Item"
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
          formData={formData}
          onChange={handleInputChange}
        />
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <Modal
          title="Update Item"
          onClose={() => setShowUpdateModal(false)}
          onSave={handleUpdate}
          formData={formData}
          onChange={handleInputChange}
          isUpdate
        />
      )}
    </div>
  );
};

const Modal = ({ title, onClose, onSave, formData, onChange }) => (
  <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={onChange}
            className="form-control mb-3"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={formData.price}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  </div>
);

export default Items;
