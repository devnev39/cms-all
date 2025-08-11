import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../features/user/cartSlice";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import "../../Styles/Landing.css";

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

// Read cart from session storage on page load
const getCartFromSession = () => {
  try {
    const cart = JSON.parse(sessionStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const Item = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.items);
  const cart = useSelector((state) => state.cart.cart); // Redux cart
  const user = useCurrentUser();

  const [quantity, setQuantity] = useState(1);

  // Hydrate Redux cart from session storage on mount
  useEffect(() => {
    const savedCart = getCartFromSession();
    dispatch(setCart(savedCart)); // always set, even if empty
  }, [dispatch]);

  // If user logs out, clear cart
  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem("cart");
      dispatch(setCart([]));
    }
  }, [user, dispatch]);

  // Persist Redux cart to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const item = items.find((i) => i.id === Number(id));
  if (!item) {
    return <div className="text-white text-center">Item not found.</div>;
  }

  const cartItem = cart.find((c) => c.item.id === item.id);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    dispatch(addToCart({ item, count: quantity })); // ✅ fixed property name
    setQuantity(1);
  };

  const handleQtyChange = (delta) => {
    if (!item.isAvailable) return;
    let newQty = (cartItem ? cartItem.count : quantity) + delta;
    if (newQty < 1) newQty = 1;

    const diff = newQty - (cartItem ? cartItem.count : 0);
    if (diff > 0) {
      dispatch(addToCart({ item, count: diff })); // ✅ fixed property name
    }
    setQuantity(newQty);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-3" style={glassCard}>
            <div className="row g-0">
              <div className="col-md-5">
                <img
                  src={item.imageUri}
                  alt={item.name}
                  className="img-fluid rounded-start"
                  style={{
                    height: 320,
                    objectFit: "cover",
                    borderRadius: "1rem",
                  }}
                />
              </div>
              <div className="col-md-7">
                <div className="card-body">
                  <h2 className="card-title fw-bold mb-3">{item.name}</h2>
                  <h5 className="mb-2">Caterer: {item.caterer.name}</h5>
                  <h5 className="mb-2">Price: ₹{item.price}</h5>
                  <p className="mb-2">
                    <span className="fw-bold">Available:</span>{" "}
                    {item.isAvailable ? "Yes" : "No"}
                  </p>
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-outline-light btn-sm fw-bold me-2"
                      onClick={() => handleQtyChange(-1)}
                      disabled={(cartItem ? cartItem.count : quantity) <= 1}
                    >
                      -
                    </button>
                    <span className="fs-5 mx-2">
                      {cartItem ? cartItem.count : quantity}
                    </span>
                    <button
                      className="btn btn-outline-light btn-sm fw-bold ms-2"
                      onClick={() => handleQtyChange(1)}
                      disabled={!item.isAvailable}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-success w-100 fw-bold"
                    onClick={handleAdd}
                    disabled={!item.isAvailable}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
