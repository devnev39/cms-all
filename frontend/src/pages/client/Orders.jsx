import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAllOrders } from "../../services/user/order";
import { toast } from "react-toastify";
import { setOrders } from "../../features/user/orderSlice";
import { Modal } from "react-bootstrap";
import "../../Styles/Landing.css";

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

export function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const { user } = useCurrentUser();
  const token = sessionStorage.getItem("token");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && token) {
      getAllOrders(token)
        .then((resp) => {
          dispatch(setOrders(resp.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Failed to fetch orders");
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

  const filteredOrders =
    orders?.filter(
      (order) =>
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderDetails.some((item) =>
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

  return (
    <div className="container py-4">
      <div style={glassContainer} className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Orders</h2>
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by customer or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "1rem" }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>#{order.id}</td>
                    <td>{order.customer.name}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      {order.orderType === "Items"
                        ? order.orderDetails
                            .map(
                              (item) => `${item.itemName} (${item.quantity})`
                            )
                            .join(", ")
                        : `${order.coupons.map(
                            (coupon) =>
                              `${coupon.couponType} (${coupon.couponTypeMinCount})`
                          )}`}
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order.razorpayPaymentId ? "success" : "warning"
                        }`}
                      >
                        {order.razorpayPaymentId ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              style={{ heighti: "70vh" }}
            >
              <Modal.Title>Order Details #{selectedOrder.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Customer Information</h6>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customer.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {selectedOrder.customer.mobile}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Order Information</h6>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={`badge bg-${
                        selectedOrder.razorpayPaymentId ? "success" : "warning"
                      }`}
                    >
                      {selectedOrder.razorpayPaymentId ? "Paid" : "Pending"}
                    </span>
                  </p>
                  {selectedOrder.razorpayPaymentId && (
                    <p>
                      <strong>Payment ID:</strong>{" "}
                      {selectedOrder.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>
              <h6 className="fw-bold mb-3">Order Items</h6>
              <div className="table-responsive">
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderType === "Items"
                      ? selectedOrder.orderDetails.map((item) => (
                          <tr key={item.id}>
                            <td>{item.itemName}</td>
                            <td>₹{item.itemPrice}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.itemPrice * item.quantity}</td>
                          </tr>
                        ))
                      : selectedOrder.coupons.map((coupon) => (
                          <tr key={coupon.id}>
                            <td>{coupon.couponType}</td>
                            <td>
                              ₹
                              {(coupon.couponTypeOriginalPrice -
                                coupon.couponTypeDiscountPerCoupon) *
                                coupon.couponTypeMinCount}
                            </td>
                            <td>1</td>
                            <td>
                              ₹
                              {(coupon.couponTypeOriginalPrice -
                                coupon.couponTypeDiscountPerCoupon) *
                                coupon.couponTypeMinCount}
                            </td>
                          </tr>
                        ))}
                    {}
                    <tr className="table-active">
                      <td colSpan="3" className="text-end fw-bold">
                        Grand Total:
                      </td>
                      <td className="fw-bold">₹{selectedOrder.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Orders;
