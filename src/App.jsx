import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Products from './components/Products.jsx';
import BookingAppointments from './components/BookingAppointments.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Delivery from './components/Delivery.jsx';
import Navigation from './components/Navigation.jsx';

function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <h2>Please sign up or log in first to access this page.</h2>
        <a href="/" style={{ display: 'inline-block', marginTop: 10 }}>
          Go to Signup
        </a>
      </div>
    );
  }
  return children;
}

function NotFound() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you requested doesn't exist.</p>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/login';
  return (
    <>
      {!hideNav && <Navigation />}
      {children}
    </>
  );
}

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ip = urlParams.get('ip') || localStorage.getItem('ip') || '';
    if (ip) localStorage.setItem('ip', ip);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart & orders state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [isAuthenticated, user, cart]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <Signup
                onSuccess={(u) => {
                  setIsAuthenticated(true);
                  setUser(u);
                }}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                onSuccess={(u) => {
                  setIsAuthenticated(true);
                  setUser(u);
                }}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                onSuccess={(u) => {
                  setIsAuthenticated(true);
                  setUser(u);
                }}
              />
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <Home cart={cart} appointments={appointments} user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <Products cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <BookingAppointments
                  appointments={appointments}
                  setAppointments={setAppointments}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <Cart cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <Checkout
                  cart={cart}
                  setCart={setCart}
                  appointments={appointments}
                  orders={orders}
                  setOrders={setOrders}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <Delivery orders={orders} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
