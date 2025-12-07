import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const AddToCart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, buyAll, clearCart } =
    useContext(CartContext);

const downloadInvoice = () => {
  if (!cart || cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const pdf = new jsPDF();
  pdf.setFontSize(18);

  // Top Title (emoji hata diya)
  pdf.text("Grocery Invoice", 14, 20);

  // Table headers and data
  const headers = [["Item", "Qty", "Price", "Total", "Weight"]];
  const data = cart.map((item) => [
    item.name || "Unknown",
    item.quantity || 0,
    (item.price || 0).toFixed(2),
    ((item.quantity || 0) * (item.price || 0)).toFixed(2),
    item.weight || "N/A",
  ]);

  // AutoTable
  autoTable(pdf, {
    head: headers,
    body: data,
    startY: 40,
    styles: { fontSize: 12 },
  });

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const finalY = pdf.lastAutoTable?.finalY || 50;

  pdf.setFontSize(14); // totals thoda chhota font
  pdf.text(`Subtotal: Rs ${subtotal.toFixed(2)}`, 14, finalY + 10);
  pdf.text(`GST (5%): Rs ${gst.toFixed(2)}`, 14, finalY + 20);
  pdf.text(`Grand Total: Rs ${total.toFixed(2)}`, 14, finalY + 30);

  pdf.save("invoice.pdf");
};


///////////////////
  const [showPopup, setShowPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);


  // Subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // GST
  const gst = subtotal * 0.05;

  // Final Total
  const total = subtotal + gst;

  const handlePay = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    
    if (!token) {
      // User not logged in - show login popup
      setShowPopup(false);
      setShowLoginPopup(true);
      return;
    }

    // User is logged in - proceed with payment
    buyAll();
    clearCart();
    setShowPopup(false);
    setSuccessPopup(true);
  };

  // Auto-hide success popup after 5 seconds
  useEffect(() => {
    if (successPopup) {
      const timer = setTimeout(() => {
        setSuccessPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successPopup]);


  return (
    <div className="container">
      <h2 className="fw-bold text-center mb-4" style={{ marginTop: '10rem' }}>🛒 Your Cart</h2>

      {/* CART GRID */}
      <div
        className="row"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {cart.length === 0 ? (
          <p className="text-center text-muted w-100">Cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div key={`${item.name}-${item.weight}-${index}`} className="card shadow" style={{ width: "280px" }}>
              <img
                src={item.image || item.img}
                className="card-img-top"
                alt={item.name}
                style={{ height: "180px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="text-muted">{item.weight}</p>
                <p>₹{item.price.toFixed(2)}</p>

                {/* Quantity Controls */}
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-dark"
                    onClick={() =>
                      updateQuantity(
                        item.name,
                        item.weight,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                  <span className="fw-bold">{item.quantity}</span>

                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(
                          item.name,
                          item.weight,
                          item.quantity - 1
                        );
                      }
                    }}
                  >
                    -
                  </button>
                </div>

                <p className="mt-2 fw-bold">
                  Total: ₹{(item.price * item.quantity).toFixed(2)}
                </p>

                {/* REMOVE BUTTON */}
                <button
                  className="btn btn-danger w-100"
                  onClick={() =>
                    removeFromCart(item.name, item.weight)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SHOW INVOICE BUTTON */}
      {cart.length > 0 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4"
            onClick={() => setShowPopup(true)}
          >
            View Invoice
          </button>
        </div>
      )}

      {/* ===================== INVOICE POPUP ===================== */}
      {showPopup && (
        <div
        id="invoice"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{
              width: "450px",
              position: "relative",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h4 className="fw-bold text-center mb-3">🧾 Invoice</h4>

            {/* PRODUCT DETAILS IN POPUP */}
            <div>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <img
                    src={item.img || item.image}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />

                  <div>
                    <p className="fw-bold m-0">{item.name}</p>
                    <p className="m-0">{item.weight}</p>
                    <p className="m-0">
                      Rate: ₹{item.price.toFixed(2)} × Qty: {item.quantity}
                    </p>
                    <p className="fw-bold m-0">
                      Total: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <hr />

              {/* TOTALS */}
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>GST (5%): ₹{gst.toFixed(2)}</p>

              <h5 className="fw-bold">Grand Total: ₹{total.toFixed(2)}</h5>

              <button
                className="btn btn-success w-100 mt-3"
                onClick={handlePay}
              >
                Pay Now
              </button>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={downloadInvoice}
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===================== POPUP END ===================== */}

      {/* LOGIN REQUIRED POPUP */}
      {showLoginPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{
              width: "400px",
              position: "relative",
              textAlign: "center",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowLoginPopup(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <div className="mb-3">
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "1rem",
                }}
              >
                🔒
              </div>
              <h4 className="fw-bold">Login Required</h4>
              <p className="text-muted">
                Please login first to proceed with payment.
              </p>
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
              >
                Go to Login
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowLoginPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#28a745",
            color: "white",
            padding: "15px 20px",
            borderRadius: "10px",
            zIndex: 99999,
            fontSize: "18px",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          }}
        >
          ✔️ Order Successfully Placed!
        </div>
      )}

    </div>
  );
};

export default AddToCart;
