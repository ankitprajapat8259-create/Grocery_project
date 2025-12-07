import React, { useState, useEffect, useContext } from "react";
import productsData from "../data/productsData";
import sliderImages from "../data/sliderImages";
import usePreloadImages from "../hooks/usePreloadImages";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const Home = () => {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState(
    productsData.map(item => ({
      ...item,
      basePrice: item.price,
      weight: "1kg"
    }))
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  usePreloadImages(sliderImages);

  useEffect(() => {
    if (!sliderImages || sliderImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const updateWeight = (id, weight) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const multiplier = {
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
      <div className="slider-container mb-4">
        <img
          src={sliderImages[currentSlide]}
          alt="slider"
          loading="eager"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />
      </div>

      <h2 className="mb-3">Vegetables</h2>

      <div className="row">
        {products.map((item, index) => (
          <motion.div
            key={item.id}
            className="col-md-3 mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            whileHover={{ scale: 1.03, y: -10 }}
          >
            <div className="card shadow-sm">
              <motion.img
                src={item.image}
                alt={item.name}
                className="card-img-top"
                loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
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
                  className="btn btn-success w-100"
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      img: item.image,  // ⭐ FIXED
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

export default Home;
