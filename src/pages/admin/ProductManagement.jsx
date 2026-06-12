import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../../services/productApi";
import { categoryApi } from "../../services/categoryApi";

const ProductManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    stock: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchCategories();
      if (isEditing) {
        await fetchProduct();
      }
      setLoading(false);
    };
    initialize();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      console.log("Categories response:", response);
      console.log("Categories data:", response.data);
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      console.error("Error response:", err.response);
      setError("Failed to load categories");
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productApi.getProductById(id);
      const product = response.data;
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category_id || product.category || "",
        image: null, // Keep as null for file upload, don't set existing image URL
        stock: product.stock_quantity || product.stock || "",
      });
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Failed to load product");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("category_id", parseInt(formData.category));
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      formDataToSend.append("stock_quantity", parseInt(formData.stock));
      formDataToSend.append("is_available", true);

      console.log("Sending payload:", Object.fromEntries(formDataToSend));

      if (isEditing) {
        await productApi.updateProduct(id, formDataToSend);
        setSuccess("Product updated successfully!");
      } else {
        await productApi.createProduct(formDataToSend);
        setSuccess("Product created successfully!");
      }

      // Navigate immediately instead of waiting
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to save product:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to save product");
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
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                {isEditing ? "Edit Product" : "Create New Product"}
              </h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Category</label>
                  {categories.length === 0 && !loading ? (
                    <div className="alert alert-warning">
                      No categories available. Please create categories first.
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  {formData.image && typeof formData.image === 'object' && (
                    <small className="text-muted">Selected: {formData.image.name}</small>
                  )}
                  {isEditing && !formData.image && (
                    <small className="text-muted">Keep existing image or select a new one</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
