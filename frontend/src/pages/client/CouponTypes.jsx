import React, { useEffect, useState } from 'react';
import {
  getAllCouponTypes,
  createCouponType,
  updateCouponType,
  deleteCouponType,
} from '../../services/user/couponType';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, Table } from 'react-bootstrap';

const CouponTypes = () => {
  const token = localStorage.getItem('token');
  const [couponTypes, setCouponTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCouponTypes = async () => {
    try {
      const response = await getAllCouponTypes(token);
      setCouponTypes(response.data);
    } catch (error) {
      console.error('Failed to load coupon types:', error);
    }
  };

  useEffect(() => {
    fetchCouponTypes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon type?')) {
      try {
        await deleteCouponType(id, token);
        fetchCouponTypes();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setShowModal(true);
  };

  const initialValues = {
    name: editData ? editData.name : '',
    description: editData ? editData.description : '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editData) {
        await updateCouponType({ ...editData, ...values }, token);
      } else {
        await createCouponType(values, token);
      }
      fetchCouponTypes();
      setShowModal(false);
      setEditData(null);
      resetForm();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Coupon Types</h3>
      <Button onClick={() => setShowModal(true)}>Add New</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {couponTypes.map((ct, idx) => (
            <tr key={ct.id}>
              <td>{idx + 1}</td>
              <td>{ct.name}</td>
              <td>{ct.description}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(ct)}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(ct.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editData ? 'Edit' : 'Add'} Coupon Type</Modal.Title>
        </Modal.Header>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <label>Name</label>
                <Field
                  name="name"
                  className="form-control"
                  placeholder="Enter coupon type name"
                />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>Description</label>
                <Field
                  name="description"
                  className="form-control"
                  placeholder="Enter description"
                />
                <ErrorMessage name="description" component="div" className="text-danger" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editData ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default CouponTypes;
