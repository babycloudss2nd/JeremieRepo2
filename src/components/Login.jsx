import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import soldImage from '../assets/sold2.jpg'; 

function Login({ onSuccess, navigateProp }) {
  // Use navigateProp for testing, fallback to useNavigate in production
  const navigate = navigateProp || useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  // ✅ Background image + fallback color
  const backgroundStyle = {
    backgroundImage: `url(${soldImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "brightness(0.7)", // darkens slightly for readability
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = import.meta.env.VITE_SERVER_IP || "http://3.90.159.31:5000";
      const res = await axios.post(`${API_BASE_URL}/api/login`, form);
      setMessage(res.data.message || 'Login successful');

      const user = res.data.user || { email: form.email };
      localStorage.setItem("user", JSON.stringify(user));

      if (onSuccess) onSuccess();
      navigate('/home'); // navigate to home after successful login
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div className="page-wrapper">
        <div className="signup-container" style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)", // semi-transparent white card
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          width: "320px",
          textAlign: "center"
        }}>
          <div className="signup-image" style={{ marginBottom: '20px' }}>
            <img
              src="/ChatGPT Image Aug 2, 2025, 06_25_44 PM.png"
              alt="Signup logo"
              className="signup-logo"
              style={{ width: "80px", borderRadius: "50%" }}
            />
          </div>

          <h2 className="login-heading">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Log In</button>
            {message && <p className="message">{message}</p>}
          </form>

          {/* ✅ Redirect button */}
          <button className="login-redirect" onClick={() => navigate('/')}>
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
