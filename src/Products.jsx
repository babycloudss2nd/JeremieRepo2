import React, { useEffect, useState } from "react";
import "./Products.css";
import fallbackImg from './assets/no-image.png';

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let data = await response.json();
        if (!Array.isArray(data)) data = [];
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      alert(`${product.name} quantity updated in cart ✅`);
    } else {
      setCart((prevCart) => [
        ...prevCart,
        { ...product, quantity: 1, id: product._id }
      ]);
      alert(`${product.name} added to cart ✅`);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name && p.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="products-wrapper">
      {loading ? (
        <div className="loading-state">
          <h2>Loading products...</h2>
        </div>
      ) : (
        <>
          <h1 className="page-title">Our Products</h1>

          {error && (
            <div className="error-message">
              <p>⚠️ Backend connection failed: {error}</p>
            </div>
          )}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {Object.keys(grouped).length === 0 ? (
            <div className="no-products">
              <p>No products found.</p>
            </div>
          ) : (
            Object.keys(grouped).map((category, index) => (
              <div key={index} className="category-section">
                <h2 className="category-title">{category}</h2>
                <div className="products-grid">
                  {grouped[category].map((item) => (
                    <div key={item._id} className="product-card">
                      <img
                        src={item.image || fallbackImg}
                        alt={item.name || "Product"}
                        className="product-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                      />
                      <h3 className="product-name">{item.name || "Unnamed Product"}</h3>
                      <p className="product-desc">
                        {item.description || "This is a high-quality product that you'll love!"}
                      </p>
                      <p className="product-benefit">
                        {item.benefit || "Experience the best performance and quality with this product."}
                      </p>
                      <p className="product-price">R{item.price || 0}</p>
                      <button
                        className="add-to-cart"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Products;
