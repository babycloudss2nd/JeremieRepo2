import { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import camsImage from '../assets/cams.webp';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://54.174.227.60:5000";

function Signup({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/signup`, form);
      setMessage(res.data.message);
      if (onSuccess) onSuccess();
      navigate('/login');
    } catch (err) {
      setMessage(
        'Signup failed, try again: ' +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const backgroundStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${camsImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <div className="page-wrapper">
        <div className="signup-container">
          <div className="icon-top">
            Be part of the <strong>Black Shield</strong> family today!
          </div>

          <div className="signup-image">
            <img
              src="/ChatGPT%20Image%20Aug%202,%202025,%2006_25_44%20PM.png"
              alt="Signup logo"
              className="signup-logo"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="password-hint">
              Use 8+ characters with letters & numbers
            </div>
            <button type="submit">Create Account</button>
            {message && <p className="message">{message}</p>}
          </form>

          <button className="login-redirect" onClick={() => navigate('/login')}>
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
