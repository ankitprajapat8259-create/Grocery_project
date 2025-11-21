import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoicePopup = () => {
  const { invoiceData, closeInvoice } = useContext(CartContext);

  if (!invoiceData) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Grocery Invoice", 14, 20);
    doc.text(`Date: ${invoiceData.date}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Item", "Weight", "Qty", "Rate", "Total"]],
      body: invoiceData.items.map((i) => [
        i.name,
        i.weight,
        i.quantity,
        `₹${i.price}`,
        `₹${i.price * i.quantity}`,
      ]),
    });

    const y = doc.lastAutoTable.finalY + 10;
    const gst = invoiceData.subtotal * invoiceData.gstRate;

    doc.text(`Subtotal: ₹${invoiceData.subtotal}`, 14, y);
    doc.text(`GST (5%): ₹${gst.toFixed(2)}`, 14, y + 10);
    doc.text(`Grand Total: ₹${(invoiceData.subtotal + gst).toFixed(2)}`, 14, y + 20);

    doc.save("Invoice.pdf");
  };

  return (
    <div className="invoice-overlay">
      <div className="invoice-popup">

        <button className="close-btn" onClick={closeInvoice}>X</button>

        <h2>Invoice</h2>

        <div className="invoice-scroll-area">
          {invoiceData.items.map((item, idx) => (
            <div key={idx} className="invoice-item-row">
              <img src={item.img} alt={item.name} className="invoice-img" />
              <span>{item.name} ({item.weight}) × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <button className="pdf-btn" onClick={downloadPDF}>
          Download PDF
        </button>

      </div>
    </div>
  );
};

export default InvoicePopup;
