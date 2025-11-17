// Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({ cart, setCart, appointments = [] }) {
  const navigate = useNavigate();

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id === id || item._id === id)
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          (item.id === id || item._id === id) && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id && item._id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id || item._id} className="cart-item-wrapper">
                <div className="cart-row">
                  <img
                    src={item.image || "/BACK1.jpg"} // fallback to BACK1.jpg
                    alt={item.name || "Product"}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = "/BACK1.jpg"; // fallback image
                    }}
                  />
                  <div className="cart-item-details">
                    <p className="item-name">{item.name || "Unnamed Product"}</p>
                    <p className="item-price">R{(item.price || 0).toFixed(2)}</p>
                  </div>

                  <div className="quantity-container">
                    <button className="quantity-btn" onClick={() => decreaseQty(item.id || item._id)}>-</button>
                    <span className="quantity-display">{item.quantity || 0}</span>
                    <button className="quantity-btn" onClick={() => increaseQty(item.id || item._id)}>+</button>
                  </div>

                  <div className="total-price">
                    R{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </div>
                </div>

                <div className="remove-container">
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id || item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Subtotal: </span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Shipping: </span>
              <span>R{subtotal > 500 ? "0.00" : "50.00"}</span>
            </div>
            <div className="cart-total total-row">
              <span>Total: </span>
              <span>R{(subtotal + (subtotal > 500 ? 0 : 50)).toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
