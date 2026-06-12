import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderApi } from "../../services/orderApi";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      const allOrders = response.data || [];
      const orderDetail = allOrders.find(o => o.id === parseInt(orderId));
      setOrder(orderDetail);
      setSelectedStatus(orderDetail?.order_status);
    } catch (err) {
      console.error("Failed to fetch order detail:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.order_status) {
      return;
    }

    try {
      setUpdating(true);
      await orderApi.updateOrderStatus(orderId, { order_status: selectedStatus });
      // Refresh order details after update
      await fetchOrderDetail();
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
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
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
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
                <p><strong>User:</strong> {order.user?.email || "N/A"}</p>
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
                <div className="mt-3">
                  <label className="form-label fw-bold">Update Status:</label>
                  <select
                    className="form-select mb-2"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={handleStatusUpdate}
                    disabled={updating || selectedStatus === order.order_status}
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </button>
                </div>
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

export default OrderDetail;
