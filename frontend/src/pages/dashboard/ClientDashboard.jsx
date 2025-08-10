import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAllOrders } from "../../services/user/order";
import { setOrders } from "../../features/user/orderSlice";
import { toast } from "react-toastify";
import "../../Styles/Landing.css";
import { getCatererByUserId } from "../../services/user/caterer";
import { setCaterer } from "../../features/user/catererSlice";

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
  background: "rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "20px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  transition: "transform 0.2s ease-in-out",
};

function ClientDashboard() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders) || [];
  const caterer = useSelector((state) => state.caterer.caterer);
  const { user } = useCurrentUser();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (user && token) {
      if (!caterer) {
        getCatererByUserId(user.id, token)
          .then((resp) => {
            dispatch(setCaterer(resp.data));
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || "Update failed !");
          });
      }
      getAllOrders(token)
        .then((resp) => {
          dispatch(setOrders(resp.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Failed to fetch orders");
        });
    }
  }, [dispatch, user, token, caterer]);

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  // Calculate today's revenue
  const today = new Date().toISOString().split("T")[0];
  const todayRevenue = orders
    .filter((order) => order.createdAt.startsWith(today))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Get count of paid orders
  const paidOrders = orders.filter((order) => order.razorpayPaymentId).length;

  return (
    <div className="container py-4">
      <div style={glassContainer} className="mb-4">
        <div className="text-center mb-5">
          <h1 className="display-4 mb-2">{caterer?.name || "Loading..."}</h1>
          <p className="lead text-white-50">Dashboard Overview</p>
        </div>

        <div className="row g-4">
          {/* Total Orders Card */}
          <div className="col-md-6 col-lg-3">
            <div style={statCard} className="h-100 text-center">
              <h3 className="fs-2 mb-3">{totalOrders}</h3>
              <p className="mb-1 text-white-50">Total Orders</p>
              <small className="text-success">{paidOrders} Paid</small>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="col-md-6 col-lg-3">
            <div style={statCard} className="h-100 text-center">
              <h3 className="fs-2 mb-3">₹{totalRevenue.toFixed(2)}</h3>
              <p className="mb-1 text-white-50">Total Revenue</p>
              <small className="text-white-50">All Time</small>
            </div>
          </div>

          {/* Today's Revenue Card */}
          <div className="col-md-6 col-lg-3">
            <div style={statCard} className="h-100 text-center">
              <h3 className="fs-2 mb-3">₹{todayRevenue.toFixed(2)}</h3>
              <p className="mb-1 text-white-50">Today's Revenue</p>
              <small className="text-white-50">
                {
                  orders.filter((order) => order.createdAt.startsWith(today))
                    .length
                }{" "}
                Orders
              </small>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="col-md-6 col-lg-3">
            <div style={statCard} className="h-100 text-center">
              <h3 className="fs-2 mb-3">
                ₹
                {totalOrders ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
              </h3>
              <p className="mb-1 text-white-50">Average Order Value</p>
              <small className="text-white-50">Per Order</small>
            </div>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="mt-5">
          <h4 className="mb-4">Recent Orders</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer.name}</td>
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
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
