import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { productApi } from "../services/productApi";
import { categoryApi } from "../services/categoryApi";

const CategoryPage = () => {
  const { addToCart } = useContext(CartContext);
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // If categoryId is undefined (home page), show all products
        if (!categoryId) {
          setCategory({ name: "All Products" });
          const response = await productApi.getProducts();
          const productsData = response.data || [];
          
          const mappedProducts = productsData.map(item => ({
            ...item,
            basePrice: parseFloat(item.price),
            weight: "1kg"
          }));
          
          setProducts(mappedProducts);
        } else {
          // Get category details
          const categoryRes = await categoryApi.getCategoryById(categoryId);
          setCategory(categoryRes.data);
          
          // Get products filtered by category
          const response = await productApi.getProducts({ category: categoryId });
          const productsData = response.data || [];
          
          const mappedProducts = productsData.map(item => ({
            ...item,
            basePrice: parseFloat(item.price),
            weight: "1kg"
          }));
          
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch category products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  const updateWeight = (productId, newWeight) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;

        const weightMultiplier =
          newWeight === "250g" ? 0.25 : newWeight === "500g" ? 0.5 : newWeight === "2kg" ? 2 : 1;
        const finalPrice = (item.basePrice * weightMultiplier).toFixed(2);

        return { ...item, weight: newWeight, price: finalPrice };
      })
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container py-5" style={{ marginTop: "1rem" }}>
      <h2 className="mb-4">{category?.name || "Category"}</h2>
      
      {products.length === 0 ? (
        <p className="text-muted">No products found in this category.</p>
      ) : (
        <div className="row">
          {products.map((item) => {
            const weightMultiplier =
              item.weight === "250g" ? 0.25 : item.weight === "500g" ? 0.5 : item.weight === "2kg" ? 2 : 1;
            const finalPrice = (item.basePrice * weightMultiplier).toFixed(2);

            return (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <motion.img
                    src={item.image}
                    className="card-img-top"
                    loading="lazy"
                    whileHover={{ scale: 1.08 }}
                    style={{ height: "300px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h5>{item.name}</h5>
                    <p className="text-muted small">{item.description || ""}</p>
                    <p className="fw-bold">₹ {parseFloat(item.price).toFixed(2)}</p>
                    <p className="text-muted small">Stock: {item.stock_quantity || item.stock || 0}</p>

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
                      onClick={() => addToCart({ ...item, price: finalPrice })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
