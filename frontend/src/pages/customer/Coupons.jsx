import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { cashCoupon, getAllCoupons } from "../../services/user/coupon";
import {
  setCoupons,
  updateCoupon as updateCouponRedux,
} from "../../features/user/couponSlice";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "../../Styles/Landing.css";
import { useNavigate } from "react-router";

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
  height: "100%",
};

const emptyCard = {
  ...glassCard,
  opacity: 0.5,
  cursor: "not-allowed",
};

function Coupons() {
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupon.coupons);
  const { user } = useCurrentUser();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token && (!coupons || coupons.length === 0)) {
      getAllCoupons(token)
        .then((resp) => {
          dispatch(setCoupons(resp.data));
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || "Failed to fetch coupons"
          );
        });
    }
  }, [dispatch, user, token, coupons]);

  const handleCouponClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleUseCoupon = async () => {
    if (!selectedCoupon || selectedCoupon.count === 0) return;

    setLoading(true);

    try {
      const response = await cashCoupon(selectedCoupon.id, token);
      dispatch(updateCouponRedux(response.data));
      toast.success("Coupon used successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to use coupon");
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (coupon) => {
    return coupon.couponTypeDiscountPerCoupon * coupon.couponTypeMinCount;
  };

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Your Coupons</h2>
      <div className="row g-4">
        {coupons && coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="col-12 col-md-6 col-lg-4"
              onClick={() => handleCouponClick(coupon)}
            >
              <div
                className="card"
                style={coupon.count > 0 ? glassCard : emptyCard}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title fw-bold mb-3">
                      {coupon.couponType}
                    </h5>
                    <span
                      className={`badge ${
                        coupon.count > 0 ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {coupon.count} remaining
                    </span>
                  </div>
                  <p className="card-text mb-1">
                    <small className="text-white-50">
                      Caterer: {coupon.caterer.name}
                    </small>
                  </p>
                  <p className="card-text mb-2">
                    <small className="text-white-50">
                      Valid till: {formatDate(coupon.validity)}
                    </small>
                  </p>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between">
                      <span>Original Price:</span>
                      <span>₹{coupon.couponTypeOriginalPrice}</span>
                    </div>
                    <div className="d-flex justify-content-between text-success">
                      <span>Discount Price:</span>
                      <span>
                        ₹
                        {coupon.couponTypeOriginalPrice -
                          coupon.couponTypeDiscountPerCoupon}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mt-2 fw-bold">
                      <span>Total Savings:</span>
                      <span className="text-success">
                        ₹{calculateSavings(coupon)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white">No coupons found.</div>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="bg-dark text-white"
      >
        {selectedCoupon && (
          <>
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-secondary"
            >
              <Modal.Title>
                {selectedCoupon.couponType} Coupon Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Coupon Information</h6>
                <p className="mb-2">
                  <strong>Caterer:</strong> {selectedCoupon.caterer.name}
                </p>
                <p className="mb-2">
                  <strong>Valid Till:</strong>{" "}
                  {formatDate(selectedCoupon.validity)}
                </p>
                <p className="mb-2">
                  <strong>Uses Remaining:</strong> {selectedCoupon.count}
                </p>
                <p className="mb-2">
                  <strong>Original Price:</strong> ₹
                  {selectedCoupon.couponTypeOriginalPrice}
                </p>
                <p className="mb-2">
                  <strong>Discount Per Use:</strong> ₹
                  {selectedCoupon.couponTypeDiscountPerCoupon}
                </p>
                <p className="mb-2">
                  <strong>Total Potential Savings:</strong> ₹
                  {calculateSavings(selectedCoupon)}
                </p>
              </div>
              {selectedCoupon.count > 0 && (
                <div className="d-grid">
                  <button
                    className="btn btn-success"
                    onClick={handleUseCoupon}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Use Coupon"}
                  </button>
                </div>
              )}
              <button
                className="btn btn-outline-primary my-2 w-100"
                onClick={() => navigate(`/coupon-usage/${selectedCoupon.id}`)}
              >
                Show History
              </button>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Coupons;
