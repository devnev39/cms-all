import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "../../Styles/Landing.css";
import { getAllOrders, updateOrder } from "../../services/user/order";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrders,
  updateOrder as updateOrderRedux,
} from "../../features/user/orderSlice";
import { toast } from "react-toastify";

const glassContainer = {
  background: "rgba(33,37,41,0.85)",
  borderRadius: "18px",
  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
  padding: "20px",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
};

const watermarkStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) rotate(-45deg)",
  fontSize: "2rem",
  opacity: "0.1",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  userSelect: "none",
  color: "#fff",
  width: "100%",
  textAlign: "center",
};

function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const order =
    orders.length != 0
      ? orders.filter((ord) => ord.id === location.state.order.id)[0]
      : null;

  const [timeLeft, setTimeLeft] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  const token = sessionStorage.getItem("token");

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

  const getValidUntil = (createdAt) => {
    const date = new Date(createdAt);
    date.setMinutes(date.getMinutes() + 10);
    return date;
  };

  const updateTimer = (createdAt) => {
    const now = new Date();
    const validUntil = getValidUntil(createdAt);
    const diff = validUntil - now;

    if (diff <= 0) {
      setIsValid(false);
      setTimeLeft("Expired");
      clearInterval(intervalId);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  useEffect(() => {
    if (!orders.length && token) {
      getAllOrders(token)
        .then((resp) => {
          dispatch(setOrders(resp.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Create failed");
        });
    }
  }, []);

  useEffect(() => {
    console.log(order);

    let id = null;

    if (!order) {
      // navigate("/orders");
      return;
    }
    if (order.isValid) {
      id = setInterval(() => {
        updateTimer(order.createdAt);
      }, 1000);
      setIntervalId(id);
      updateTimer(order.createdAt);
    } else {
      setIsValid(false);
      setTimeLeft("Expired");
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [order, navigate]);

  const handleInvalidate = () => {
    setIsValid(false);
    setTimeLeft("Invalidated");
    clearInterval(intervalId);
    updateOrder({ id: order.id, isValid: false }, token).then((resp) => {
      dispatch(updateOrderRedux(resp.data));
      // setOrder(resp.data);
    });
  };

  if (!order) return null;

  return (
    <div className="container py-5">
      <div style={glassContainer} className="position-relative">
        <div style={watermarkStyle}>
          Valid until: {formatDate(getValidUntil(order.createdAt))}
        </div>
        <div
          style={{
            ...watermarkStyle,
            top: "50%",
            left: "10%",
            color: "rgba(216, 211, 211, 0.52)",
          }}
        >
          Valid until: {formatDate(getValidUntil(order.createdAt))}
        </div>
        <div
          style={{
            ...watermarkStyle,
            top: "50%",
            left: "70%",
            color: "rgba(242, 231, 17, 0.5)",
          }}
        >
          Valid until: {formatDate(getValidUntil(order.createdAt))}
        </div>
        <div
          style={{
            ...watermarkStyle,
            top: "50%",
            left: "30%",
            color: "rgba(244, 140, 183, 0.5)",
          }}
        >
          Valid until: {formatDate(getValidUntil(order.createdAt))}
        </div>
        <div style={{ ...watermarkStyle, top: "50%", left: "90%" }}>
          Valid until: {formatDate(getValidUntil(order.createdAt))}
        </div>
        <div className="text-center mb-4">
          <h2 className="display-6 mb-0">Receipt</h2>
          <p className="text-white-50 mb-0">Order #{order.id}</p>
          <p className="text-white-50">{formatDate(order.createdAt)}</p>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <h5 className="mb-3">Customer Details</h5>
            <p className="mb-1">
              <strong>Name:</strong> {order.customer.name}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {order.customer.email}
            </p>
            <p className="mb-1">
              <strong>Mobile:</strong> {order.customer.mobile}
            </p>
          </div>
          <div className="col-md-6">
            <h5 className="mb-3">Caterer Details</h5>
            <p className="mb-1">
              <strong>Name:</strong> {order.catererName}
            </p>
          </div>
        </div>

        <div className="table-responsive mb-4">
          <table className="table table-dark table-hover">
            <thead>
              {order.orderType === "Items" ? (
                <tr>
                  <th>Item</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Quantity</th>
                  <th className="text-end">Total</th>
                </tr>
              ) : (
                <tr>
                  <th>Coupon</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              )}
            </thead>
            <tbody>
              {order && order.orderType === "Items"
                ? order.orderDetails.map((item) => (
                    <tr key={item.id}>
                      <td>{item.itemName}</td>
                      <td className="text-end">₹ {item.itemPrice}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">
                        ₹{item.itemPrice * item.quantity}
                      </td>
                    </tr>
                  ))
                : order.coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>{coupon.couponType}</td>
                      <td className="text-end">
                        ₹{" "}
                        {(coupon.couponTypeOriginalPrice -
                          coupon.couponTypeDiscountPerCoupon) *
                          coupon.couponTypeMinCount}
                      </td>
                      <td className="text-end">
                        ₹{" "}
                        {(coupon.couponTypeOriginalPrice -
                          coupon.couponTypeDiscountPerCoupon) *
                          coupon.couponTypeMinCount}
                      </td>
                    </tr>
                  ))}
              <tr className="table-active">
                <td
                  colSpan={order && order.orderType === "Items" ? 3 : 2}
                  className="text-end fw-bold"
                >
                  Grand Total:
                </td>
                <td className="text-end fw-bold">₹{order.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-column align-items-center gap-3">
          <div
            className={`text-center ${isValid ? "text-white" : "text-danger"}`}
          >
            <h4 className="mb-0">Time Remaining</h4>
            <div className="display-6">{timeLeft}</div>
          </div>

          <button
            className="btn btn-danger"
            onClick={handleInvalidate}
            disabled={!isValid}
          >
            Invalidate Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
