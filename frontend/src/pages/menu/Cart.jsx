import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOneMoreToCart,
  removeFromCart,
  removeOneFromCart,
  setCart,
} from "../../features/user/cartSlice";
import "../../Styles/Landing.css";
import { createOrder } from "../../services/user/order";
import { toast } from "react-toastify";
import { addOrder } from "../../features/user/orderSlice";
import { useNavigate } from "react-router";

const glassCard = {
  background: "rgba(33,37,41,0.65)",
  borderRadius: "18px",
  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  margin: "24px 0",
};

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart) || [];
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  // Calculate totals
  const totalItems = cart.reduce(
    (sum, c) => sum + (c.count || c.quantity || 0),
    0
  );
  const totalAmount = cart.reduce(
    (sum, c) => sum + c.item.price * (c.count || c.quantity || 0),
    0
  );

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
    sessionStorage.setItem(
      "cart",
      JSON.stringify(cart.filter((c) => c.item.id !== item.id))
    );
  };

  const handleMinus = (item) => {
    dispatch(removeOneFromCart(item));
    const updated = cart
      .map((c) =>
        c.item.id === item.id ? { ...c, count: (c.count || c.quantity) - 1 } : c
      )
      .filter((c) => (c.count || c.quantity) > 0);
    sessionStorage.setItem("cart", JSON.stringify(updated));
    dispatch(setCart(updated));
  };

  const handlePlus = (item) => {
    dispatch(addOneMoreToCart(item));
    const updated = cart.map((c) =>
      c.item.id === item.id ? { ...c, count: (c.count || c.quantity) + 1 } : c
    );
    sessionStorage.setItem("cart", JSON.stringify(updated));
    dispatch(setCart(updated));
  };

  const checkoutCart = () => {
    // Take current cart in redux
    const catererId = cart.length ? cart[0].item.caterer.id : undefined;
    if (!catererId) {
      toast.error("Cannot find caterer !");
      return;
    }
    createOrder({ cartItems: cart, catererId }, token)
      .then((resp) => {
        dispatch(addOrder(resp.data));
        toast.success("Order placed !");
        dispatch(setCart([]));
        sessionStorage.setItem("cart", JSON.stringify([]));
        navigate("/orders");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Update failed");
      });
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Items Section */}
        <div className="col-12 col-lg-8">
          <div className="card" style={glassCard}>
            <div className="card-body">
              <h3 className="fw-bold mb-4">Cart Items</h3>
              <hr />
              {cart.length === 0 ? (
                <div className="text-center text-white">
                  Your cart is empty.
                </div>
              ) : (
                cart.map((c) => (
                  <div
                    key={c.item.id}
                    className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 p-3 rounded"
                    style={{ background: "rgba(0,0,0,0.25)" }}
                  >
                    <div
                      className="d-flex align-items-center gap-3 mb-2 mb-md-0"
                      style={{ minWidth: 0 }}
                    >
                      <img
                        src={c.item.imageUri}
                        alt={c.item.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-bold fs-5 text-truncate">
                          {c.item.name}
                        </div>
                        <div className="text-white-50">
                          Caterer: {c.item.caterer.name}
                        </div>
                        <div className="text-success">₹{c.item.price}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm fw-bold"
                        onClick={() => handleMinus(c.item)}
                        disabled={(c.count || c.quantity) <= 1}
                      >
                        -
                      </button>
                      <span className="fs-5 mx-2">{c.count || c.quantity}</span>
                      <button
                        className="btn btn-outline-primary btn-sm fw-bold"
                        onClick={() => handlePlus(c.item)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => handleRemove(c.item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Totals Section */}
        <div className="col-12 col-lg-4">
          <div className="card" style={glassCard}>
            <div className="card-body">
              <h3 className="fw-bold mb-4">Totals</h3>
              <hr />
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total Items:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="fw-bold">Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
              <div
                className="alert alert-info text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "none",
                }}
              >
                Please review your cart before checkout.
              </div>
              <button
                className="btn btn-success w-100 fw-bold"
                disabled={cart.length === 0}
                onClick={() => checkoutCart()}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
