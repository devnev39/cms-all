import React, { useEffect, useState } from 'react';
import {
  getAllItems,
  deleteItem as deleteItemById,
  updateItem,
  createItem
} from '../../services/user/items';

const Items = () => {
  const [items, setItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [isAdding, setIsAdding] = useState(false);

  const token = sessionStorage.getItem("token");

  const fetchItems = async () => {
    try {
      const res = await getAllItems(token);
      setItems(res.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteItemById(id, token);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleEditClick = (item) => {
    setIsAdding(false);
    setEditItemId(item.id);
    setFormData({ name: item.name, price: item.price });
  };

  const handleCancel = () => {
    setEditItemId(null);
    setIsAdding(false);
    setFormData({ name: '', price: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        await updateItem({ id: editItemId, ...formData }, token);
      } else if (isAdding) {
        await createItem(formData, token);
      }
      fetchItems();
      handleCancel();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  return (
    <div className="container py-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Your Items</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setEditItemId(null);
            setIsAdding(true);
            setFormData({ name: '', price: '' });
          }}
        >
          Add Item
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow p-3 mx-auto" style={{ maxWidth: "900px" }}>
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-success text-dark">
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(isAdding || editItemId) && (
              <tr className="table-warning">
                <td>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Item name"
                  />
                </td>
                <td>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Item price"
                  />
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" onClick={handleFormSubmit}>
                      Save
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {items.map(item => (
              editItemId === item.id ? null : (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(item)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Items;
