import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAllOrders } from "../../services/user/order";
import { toast } from "react-toastify";
import { setOrders } from "../../features/user/orderSlice";
import { Modal } from "react-bootstrap";
import "../../Styles/Landing.css";

const glassCard = {
  background: "rgba(33,37,41,0.65)",
  borderRadius: "18px",
  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  margin: "12px 0",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
};

export function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const { user } = useCurrentUser();
  const token = sessionStorage.getItem("token");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && token) {
      getAllOrders(token)
        .then((resp) => {
          dispatch(setOrders(resp.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Update failed");
        });
    }
  }, [dispatch, user, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Your Orders</h2>
      <div className="row">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div className="col-12 col-md-6 col-lg-4" key={order.id}>
              <div
                className="card h-100"
                style={glassCard}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">{order.catererName}</h5>
                  <p className="card-text mb-1">
                    <small className="text-white-50">
                      {formatDate(order.createdAt)}
                    </small>
                  </p>
                  <div className="mt-2">
                    {order.orderDetails.map((item) => (
                      <div key={item.id} className="mb-1">
                        {item.itemName} x {item.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total:</span>
                    <span className="text-success fw-bold">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white">No orders found.</div>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        contentClassName="bg-dark text-white"
      >
        {selectedOrder && (
          <>
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-secondary"
            >
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Order Information</h6>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <strong>Caterer:</strong> {selectedOrder.catererName}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Items</h6>
                  <div className="table-responsive">
                    <table className="table table-dark table-striped">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderDetails.map((item) => (
                          <tr key={item.id}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.itemPrice}</td>
                            <td>₹{item.itemPrice * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Orders;
