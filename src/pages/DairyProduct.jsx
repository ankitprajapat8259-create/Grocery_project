import React, { useState, useContext } from "react";
import dairyData from "../data/dairyData";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const DairyProduct = () => {
  const { addToCart } = useContext(CartContext);

  const [dairy, setDairy] = useState(
    dairyData.map(item => ({
      ...item,
      basePrice: item.price,
      weight: "1kg"
    }))
  );

  const updateWeight = (id, weight) => {
    setDairy(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        let multiplier = {
          "250g": 0.25,
          "500g": 0.5,
          "1kg": 1,
          "2kg": 2
        }[weight] || 1; // Default to 1 if weight is invalid

        return { ...item, weight, price: item.basePrice * multiplier };
      })
    );
  };

  return (
    <div style={{ marginTop: "5rem" }}>
      <h2>Dairy Products</h2>

      <div className="row">
        {dairy.map((item, i) => (
          <motion.div
            key={item.id}
            className="col-md-3 mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ scale: 1.03, y: -10 }}
          >
            <div className="card shadow-sm">
              <motion.img
                src={item.image}
                style={{ height: "300px", objectFit: "cover" }}
                className="card-img-top"
                loading="lazy"
                whileHover={{ scale: 1.08 }}
              />

              <div className="card-body">
                <h5>{item.name}</h5>
                <p className="fw-bold">₹ {item.price.toFixed(2)}</p>

                <select
                  className="form-control mb-2"
                  value={item.weight}
                  onChange={(e) => updateWeight(item.id, e.target.value)}
                >
                  <option value="1kg">1kg</option>
                  <option value="250g">250g</option>
                  <option value="500g">500g</option>
                  <option value="2kg">2kg</option>
                </select>

                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      img: item.image, // ⭐ FIXED
                      weight: item.weight,
                      price: item.price
                    })
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DairyProduct;
