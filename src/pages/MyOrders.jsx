import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../services/orderApi";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", marginTop: "5rem" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No orders found. <a href="/" className="alert-link">Start shopping</a> to place your first order.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {order.items && order.items.length > 0 ? (
                      <div>
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.product?.name || item.name || "N/A"}
                            {idx < order.items.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "No items"
                    )}
                  </td>
                  <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.order_status === 'Delivered' ? 'bg-success' :
                      order.order_status === 'Pending' ? 'bg-warning' :
                      order.order_status === 'Cancelled' ? 'bg-danger' :
                      order.order_status === 'Confirmed' ? 'bg-info' :
                      order.order_status === 'Shipped' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {order.order_status || "Pending"}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/my-orders/${order.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
