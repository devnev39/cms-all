import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../features/user/itemSlice";
import { getAllOpenItems } from "../../services/user/items";
import "../../Styles/Landing.css";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router";
import {
  addOneMoreToCart,
  addToCart as addToCartRedux,
  removeFromCart as removeFromCartRedux,
  removeOneFromCart,
  setCart,
} from "../../features/user/cartSlice";

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

const Menu = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.items);
  const [filtered, setFiltered] = useState([]);
  const [catererId, setCatererId] = useState("all");
  const [showAvailable, setShowAvailable] = useState("all");
  const [search, setSearch] = useState("");

  const cart = useSelector((state) => state.cart.cart);

  const { user } = useCurrentUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) dispatch(setCart(JSON.parse(sessionStorage.getItem("cart"))));
    else sessionStorage.removeItem("cart");
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) {
      getAllOpenItems().then((resp) => {
        dispatch(setItems(resp.data));
      });
    }
  }, [dispatch, items]);

  useEffect(() => {
    let data = items || [];
    if (catererId !== "all") {
      data = data.filter((item) => item.caterer.id === Number(catererId));
    }
    if (showAvailable !== "all") {
      data = data.filter(
        (item) => item.isAvailable === (showAvailable === "true")
      );
    }
    if (search.trim() !== "") {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(s) ||
          item.caterer.name.toLowerCase().includes(s)
      );
    }
    setFiltered(data);
  }, [items, catererId, showAvailable, search]);

  // Get unique caterers for filter
  const caterers = Array.from(
    new Map(
      (items || []).map((item) => [item.caterer.id, item.caterer])
    ).values()
  );

  const addToCart = (item) => {
    if (!user) {
      sessionStorage.setItem("redirect", JSON.stringify({ to: "/menu" }));
      navigate("/login");
    } else {
      dispatch(addToCartRedux({ item, count: 1 }));
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }

    // Add to cart in session storage
  };

  const removeFromCart = (item) => {
    dispatch(removeFromCartRedux(item));
    sessionStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="container py-4">
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={catererId}
            onChange={(e) => setCatererId(e.target.value)}
          >
            <option value="all">All Caterers</option>
            {caterers.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={showAvailable}
            onChange={(e) => setShowAvailable(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="true">Available Only</option>
            <option value="false">Unavailable Only</option>
          </select>
        </div>
        <div className="col-12 col-md-4 mx-auto mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by item or caterer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: "1rem" }}
          />
        </div>
      </div>
      <div className="row">
        {filtered.length === 0 && (
          <div className="text-center text-white">No items found.</div>
        )}
        {filtered.map((item) => (
          <div className="col-md-4 col-sm-6 mb-4" key={item.id}>
            <div className="card h-100" style={glassCard}>
              <img
                src={item.imageUri}
                className="card-img-top"
                alt={item.name}
                style={{
                  height: 220,
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold d-flex align-items-center">
                  {item.name}
                  {!item.isAvailable && (
                    <span className="badge bg-danger ms-2">Not Available</span>
                  )}
                </h5>
                <p className="card-text mb-1">
                  <span className="fw-bold">Caterer:</span> {item.caterer.name}
                </p>
                <p className="card-text mb-2">
                  <span className="fw-bold">Price:</span> ₹{item.price}
                </p>
                {cart &&
                cart.length &&
                cart.filter((i) => i.item.id === item.id).length != 0 ? (
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          dispatch(removeOneFromCart(item));
                          sessionStorage.setItem("cart", JSON.stringify(cart));
                        }}
                      >
                        -
                      </button>
                      <div>
                        {cart.filter((i) => i.item.id === item.id)[0].count}
                      </div>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          dispatch(addOneMoreToCart(item));
                          sessionStorage.setItem("cart", JSON.stringify(cart));
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => removeFromCart(item)}
                    >
                      Remove from cart
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => navigate("/cart")}
                    >
                      Go to cart
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-success w-100"
                    disabled={!item.isAvailable}
                    onClick={() => addToCart(item)}
                  >
                    {item.isAvailable ? "Add to cart" : "Unavailable"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
