import React, { useEffect, useState } from "react";
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

const statCard = {
  ...glassContainer,
  textAlign: "center",
  padding: "15px",
  height: "100%",
};

function Coupons() {
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupon.coupons);
  const { user } = useCurrentUser();
  const token = sessionStorage.getItem("token");

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [showActiveCoupons, setShowActiveCoupons] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getFilteredCoupons = () => {
    return coupons.filter((coupon) => {
      const isInDateRange =
        new Date(coupon.createdAt) >= startDate &&
        new Date(coupon.createdAt) <= endDate;
      const matchesSearch =
        coupon.couponType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.caterer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isActive = !showActiveCoupons || coupon.count > 0;
      return isInDateRange && matchesSearch && isActive;
    });
  };

  const calculateStats = () => {
    const filteredCoupons = getFilteredCoupons();
    const stats = {
      totalCoupons: 0,
      totalRevenue: 0,
      byType: {},
    };

    filteredCoupons.forEach((coupon) => {
      stats.totalCoupons += coupon.count;
      stats.totalRevenue += coupon.count * coupon.couponTypeOriginalPrice;

      if (!stats.byType[coupon.couponType]) {
        stats.byType[coupon.couponType] = {
          count: 0,
          revenue: 0,
        };
      }
      stats.byType[coupon.couponType].count += coupon.count;
      stats.byType[coupon.couponType].revenue +=
        coupon.count * coupon.couponTypeOriginalPrice;
    });

    return stats;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const stats = calculateStats();

  return (
    <div className="container py-4">
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div style={statCard}>
            <h3 className="mb-2">{stats.totalCoupons}</h3>
            <p className="mb-0">Total Active Coupons</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div style={statCard}>
            <h3 className="mb-2">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="mb-0">Total Revenue</p>
          </div>
        </div>
        {Object.entries(stats.byType)
          .slice(0, 2)
          .map(([type, data]) => (
            <div key={type} className="col-md-6 col-lg-3">
              <div style={statCard}>
                <h3 className="mb-2">{data.count}</h3>
                <p className="mb-0">{type} Coupons</p>
                <small className="text-success">
                  ₹{data.revenue.toLocaleString()}
                </small>
              </div>
            </div>
          ))}
      </div>

      <div style={glassContainer}>
        <div className="row mb-4">
          <div className="col-md-3">
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
            />
          </div>
          <div className="col-md-3">
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
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control bg-dark text-white"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showActiveCoupons}
                onChange={(e) => setShowActiveCoupons(e.target.checked)}
                id="showActiveCoupons"
              />
              <label className="form-check-label" htmlFor="showActiveCoupons">
                Show Active Coupons Only
              </label>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Type</th>
                <th>Caterer</th>
                <th>Created</th>
                <th>Min Count</th>
                <th>Original Price</th>
                <th>Discount</th>
                <th>Remaining</th>
                <th>Total Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredCoupons().map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.couponType}</td>
                  <td>{coupon.caterer.name}</td>
                  <td>{formatDate(coupon.createdAt)}</td>
                  <td>{coupon.couponTypeMinCount}</td>
                  <td>₹{coupon.couponTypeOriginalPrice}</td>
                  <td>₹{coupon.couponTypeDiscountPerCoupon}</td>
                  <td>{coupon.count}</td>
                  <td>
                    ₹
                    {(
                      coupon.count * coupon.couponTypeOriginalPrice
                    ).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        coupon.count > 0 ? "success" : "secondary"
                      }`}
                    >
                      {coupon.count > 0 ? "Active" : "Exhausted"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Coupons;
