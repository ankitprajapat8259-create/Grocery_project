import React, { useState, useContext } from "react";
import fruitsData from "../data/fruitsData";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const Fruits = () => {
  const { addToCart } = useContext(CartContext);

  const [fruits, setFruits] = useState(
    fruitsData.map(item => ({
      ...item,
      basePrice: item.price,
      weight: "1kg"
    }))
  );

  const updateWeight = (id, weight) => {
    setFruits(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        let m = {
          "250g": 0.25,
          "500g": 0.5,
          "1kg": 1,
          "2kg": 2
        }[weight];

        return { ...item, weight, price: item.basePrice * m };
      })
    );
  };

  return (
    <div style={{ marginTop: "5rem" }}>
      <h2>Fruits</h2>

      <div className="row">
        {fruits.map((item, i) => (
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
                className="card-img-top"
                whileHover={{ scale: 1.08 }}
              />

              <div className="card-body">
                <h5>{item.name}</h5>
                <p className="fw-bold">₹ {item.price}</p>

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
                  className="btn btn-warning w-100"
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      img: item.image, // ⭐ FIX
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

export default Fruits;
