import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAllCoupons } from "../../services/user/coupon";
import { setCoupons } from "../../features/user/couponSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

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

const datePickerCustomStyles = {
  input: {
    backgroundColor: "rgba(33,37,41,0.65)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "8px",
    color: "white",
    padding: "8px 12px",
    width: "100%",
  },
};

function CouponUsage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupon.coupons);
  const { user } = useCurrentUser();
  const token = sessionStorage.getItem("token");

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [coupon, setCoupon] = useState(null);
  const [filteredUsage, setFilteredUsage] = useState([]);

  useEffect(() => {
    if (user && token && (!coupons || coupons.length === 0)) {
      getAllCoupons(token)
        .then((resp) => {
          dispatch(setCoupons(resp.data));
          const found = resp.data.find((c) => c.id === parseInt(id));
          if (found) {
            setCoupon(found);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || "Failed to fetch coupon details"
          );
        });
    } else {
      const found = coupons.find((c) => c.id === parseInt(id));
      if (found) {
        setCoupon(found);
      }
    }
  }, [dispatch, user, token, coupons, id]);

  useEffect(() => {
    if (coupon && coupon.couponUsage) {
      const filtered = coupon.couponUsage.filter((usage) => {
        const usageDate = new Date(usage.createdAt);
        return usageDate >= startDate && usageDate <= endDate;
      });
      setFilteredUsage(filtered);
    }
  }, [coupon, startDate, endDate]);

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

  if (!coupon) {
    return (
      <div className="container py-4">
        <div style={glassContainer} className="text-center">
          Loading coupon details...
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div style={glassContainer}>
        <div className="row mb-4">
          <div className="col-md-6">
            <h2 className="mb-3">{coupon.couponType} Coupon Usage</h2>
            <p className="mb-2">
              <strong>Caterer:</strong> {coupon.caterer.name}
            </p>
            <p className="mb-2">
              <strong>Original Price:</strong> ₹{coupon.couponTypeOriginalPrice}
            </p>
            <p className="mb-2">
              <strong>Discount Per Use:</strong> ₹
              {coupon.couponTypeDiscountPerCoupon}
            </p>
            <p className="mb-2">
              <strong>Remaining Uses:</strong> {coupon.count}
            </p>
          </div>
          <div className="col-md-6">
            <h5 className="mb-3">Select Date Range</h5>
            <div className="row g-3">
              <div className="col-6">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="form-control bg-dark text-white"
                  placeholderText="Start Date"
                  dateFormat="dd MMM yyyy"
                  style={datePickerCustomStyles.input}
                />
              </div>
              <div className="col-6">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  className="form-control bg-dark text-white"
                  placeholderText="End Date"
                  dateFormat="dd MMM yyyy"
                  style={datePickerCustomStyles.input}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Updated By</th>
                <th>Previous Count</th>
                <th>New Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsage && filteredUsage.length > 0 ? (
                filteredUsage.map((usage, index) => (
                  <tr key={index}>
                    <td>{formatDate(usage.createdAt)}</td>
                    <td>{usage.updatedBy || "System"}</td>
                    <td>{usage.previousCount}</td>
                    <td>{usage.newCount}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          usage.newCount < usage.previousCount
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {usage.newCount < usage.previousCount
                          ? "Used"
                          : "Updated"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No usage records found for the selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CouponUsage;
