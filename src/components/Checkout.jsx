import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout({ cart = [], appointments = [], setCart, orders = [], setOrders }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    surname: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    card: "",
    expiration: "",
    cvc: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((val) => val === "")) {
      alert("Please fill in all fields before proceeding.");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: cart,
      appointments: appointments,
      total: total + shipping,
      customer: {
        name: `${form.name} ${form.surname}`,
        email: form.email,
        address: `${form.city}, ${form.state}, ${form.postal}, ${form.country}`
      },
      status: "Processing",
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (setOrders) setOrders(prev => [...prev, newOrder]);
    if (setCart) setCart([]);

    alert("Order placed successfully!");
    navigate('/delivery');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal;

  return (
    <div className="checkout-container">
      <div className="items">
        <h2>Your items:</h2>
        {cart.length === 0 ? (
          <div className="empty-items">
            <p>Your cart is empty.</p>
            <button 
              onClick={() => navigate('/products')}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="item" key={item.id || item._id}>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name || "Product"} 
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                    }}
                  />
                )}
                <div className="item-details">
                  <p>
                    <b>{item.name || "Unnamed Product"}</b>
                    <br />
                    Price: R{(item.price || 0).toFixed(2)}
                    <br />
                    Quantity: {item.quantity || 0}
                    <br />
                    Total: R{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>R{shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <h3>Total: R{(total + shipping).toFixed(2)}</h3>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="payment">
        <h2>Checkout</h2>
        <h3>Payment details</h3>
        <form onSubmit={handleSubmit}>
          <label>Email address:</label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="Enter your email" 
            required 
          />

          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Enter your name" 
            required 
          />

          <label>Surname:</label>
          <input 
            type="text" 
            name="surname" 
            value={form.surname} 
            onChange={handleChange} 
            placeholder="Enter your surname" 
            required 
          />

          <label>City:</label>
          <input 
            type="text" 
            name="city" 
            value={form.city} 
            onChange={handleChange} 
            placeholder="Enter your city" 
            required 
          />

          <label>State:</label>
          <input 
            type="text" 
            name="state" 
            value={form.state} 
            onChange={handleChange} 
            placeholder="Enter your state" 
            required 
          />

          <label>Postal code:</label>
          <input 
            type="text" 
            name="postal" 
            value={form.postal} 
            onChange={handleChange} 
            placeholder="Enter postal code" 
            required 
          />

          <label>Country:</label>
          <select name="country" value={form.country} onChange={handleChange} required>
            <option value="">Select Country</option>
            <option value="ZA">South Africa</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>

          <label>Card number:</label>
          <input 
            type="text" 
            name="card" 
            maxLength="19" 
            value={form.card} 
            onChange={handleChange} 
            placeholder="1234 5678 9012 3456" 
            required 
          />

          <label>Expiration:</label>
          <input 
            type="text" 
            name="expiration" 
            placeholder="MM/YY" 
            value={form.expiration} 
            onChange={handleChange} 
            maxLength="5"
            required 
          />

          <label>CVC:</label>
          <input 
            type="text" 
            name="cvc" 
            maxLength="4" 
            value={form.cvc} 
            onChange={handleChange} 
            placeholder="123" 
            required 
          />

          <button 
            type="submit" 
            disabled={cart.length === 0}
            className={cart.length === 0 ? 'disabled' : ''}
          >
            {cart.length === 0 ? 'Cart is Empty' : `Pay R${(total + shipping).toFixed(2)}`}
          </button>
        </form>

        <div className="payment-logos">
          <img src="/payment.jpg" alt="Payment Methods" />
        </div>
      </div>

      <div className="appointments">
        <h2>Your appointments:</h2>
        {appointments.length === 0 ? (
          <div className="empty-appointments">
            <p>No appointments booked yet.</p>
            <button 
              onClick={() => navigate('/booking')}
              className="book-appointment-btn"
            >
              Book Appointment
            </button>
          </div>
        ) : (
          appointments.map((appt, index) => (
            <div className="appointment" key={appt.id || index}>
              <h4>{appt.type || "Appointment"}</h4>
              <p>
                <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
                <br />
                <strong>Time:</strong> {appt.time}
                <br />
                <strong>Location:</strong> {appt.location || appt.address || appt.platform}
                {appt.platform && (
                  <>
                    <br />
                    <strong>Platform:</strong> {appt.platform}
                  </>
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Checkout;
