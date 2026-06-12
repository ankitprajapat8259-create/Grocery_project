import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderApi } from "../services/orderApi";

const MyOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error("Failed to fetch order detail:", err);
      setError("Failed to load order details");
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
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Details #{orderId}</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate("/my-orders")}
        >
          Back to My Orders
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {order && (
        <div className="card shadow">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Order ID:</strong> #{order.id}</p>
                <p><strong>Status:</strong>
                  <span className={`badge ms-2 ${
                    order.order_status === 'Delivered' ? 'bg-success' :
                    order.order_status === 'Pending' ? 'bg-warning' :
                    order.order_status === 'Cancelled' ? 'bg-danger' :
                    order.order_status === 'Confirmed' ? 'bg-info' :
                    order.order_status === 'Shipped' ? 'bg-primary' : 'bg-secondary'
                  }`}>
                    {order.order_status || "Pending"}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p><strong>Total Amount:</strong> ₹{parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>

            <h5 className="mt-4 mb-3">Order Items</h5>
            {order.items && order.items.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Weight</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product?.name || item.name || "N/A"}</td>
                        <td>{item.weight || "1kg"}</td>
                        <td>{item.quantity}</td>
                        <td>₹{parseFloat(item.price || 0).toFixed(2)}</td>
                        <td>₹{parseFloat((item.price || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No items found for this order.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrderDetail;
