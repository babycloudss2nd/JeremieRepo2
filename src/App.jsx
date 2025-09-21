import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './signup.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import Products from './Products.jsx';
import BookingAppointments from './BookingAppointments.jsx';
import Cart from './Cart.jsx';
import Checkout from './Checkout.jsx';
import Delivery from './Delivery.jsx';
import Navigation from './Navigation.jsx';

function ProtectedRouteWrapper({ isAuth, children }) {
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

function Layout({ children, isAuthenticated }) {
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === 'undefined') return null;
    try {
      return JSON.parse(savedUser);
    } catch (err) {
      console.error('Failed to parse user from localStorage', err);
      return null;
    }
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart || savedCart === 'undefined') return [];
    try {
      return JSON.parse(savedCart);
    } catch (err) {
      console.error('Failed to parse cart from localStorage', err);
      return [];
    }
  });

  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [isAuthenticated, user, cart]);

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated}>
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
              <ProtectedRouteWrapper isAuth={isAuthenticated}>
                <Home cart={cart} appointments={appointments} user={user} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRouteWrapper isAuth={isAuthenticated}>
                <Products cart={cart} setCart={setCart} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRouteWrapper isAuth={isAuthenticated}>
                <BookingAppointments
                  appointments={appointments}
                  setAppointments={setAppointments}
                />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRouteWrapper isAuth={isAuthenticated}>
                <Cart cart={cart} setCart={setCart} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRouteWrapper isAuth={isAuthenticated}>
                <Checkout
                  cart={cart}
                  setCart={setCart}
                  appointments={appointments}
                  orders={orders}
                  setOrders={setOrders}
                />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRouteWrapper isAuth={isAuthenticated}>
                <Delivery orders={orders} />
              </ProtectedRouteWrapper>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
