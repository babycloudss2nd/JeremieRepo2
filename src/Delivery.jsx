import React from "react";
import "./Delivery.css";

function Delivery({ orders = [], cart = [], appointments = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "#f39c12";
      case "Shipped": return "#3498db";
      case "Delivered": return "#27ae60";
      case "Cancelled": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  const getDeliveryDate = (orderDate) => {
    const order = new Date(orderDate);
    const delivery = new Date(order.getTime() + 5 * 24 * 60 * 60 * 1000);
    return delivery.toLocaleDateString();
  };

  const getProgressPercent = (status) => {
    switch (status) {
      case "Processing": return 25;
      case "Shipped": return 75;
      case "Delivered": return 100;
      default: return 0;
    }
  };

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>Order Tracking & Delivery</h1>
        <p>Track your orders and delivery status</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your delivery tracking here!</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="shop-now-btn"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    Placed: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${getProgressPercent(order.status)}%`,
                    backgroundColor: getStatusColor(order.status)
                  }}
                ></div>
              </div>

              <div className="order-items">
                <h4>Items ({order.items.length}):</h4>
                <div className="items-grid">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.image || "https://via.placeholder.com/60x60?text=No+Image"} 
                        alt={item.name} 
                        className="item-image"
                      />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Qty: {item.quantity}</p>
                        <p className="item-price">R{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="delivery-info">
                <div className="delivery-details">
                  <div className="detail-item">
                    <span className="detail-label">Customer:</span>
                    <span className="detail-value">{order.customer.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{order.customer.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{order.customer.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estimated Delivery:</span>
                    <span className="detail-value">
                      {order.status === "Delivered" ? "Delivered" : getDeliveryDate(order.orderDate)}
                    </span>
                  </div>
                </div>

                <div className="order-total">
                  <h4>Total: R{order.total.toFixed(2)}</h4>
                </div>
              </div>

              {order.appointments && order.appointments.length > 0 && (
                <div className="order-appointments">
                  <h4>Associated Appointments:</h4>
                  {order.appointments.map((appt, index) => (
                    <div key={index} className="appointment-item">
                      <p>
                        <strong>{appt.type}</strong> - {new Date(appt.date).toLocaleDateString()} at {appt.time}
                        <br />
                        <small>{appt.location}</small>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Delivery;
