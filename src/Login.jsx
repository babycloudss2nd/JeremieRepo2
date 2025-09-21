import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import loginBack from './assets/loginback.jpg';

function Login({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = process.env.VITE_SERVER_IP || "http://54.174.227.60:5000";
      const res = await axios.post(`${API_BASE_URL}/api/login`, form);
      setMessage(res.data.message || 'Login successful');

      const user = res.data.user || { email: form.email };
      localStorage.setItem("user", JSON.stringify(user));

      if (onSuccess) onSuccess();
      navigate('/home');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${loginBack})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <div className="page-wrapper">
        <div className="signup-container">
          <div className="signup-image" style={{ marginBottom: '20px' }}>
            <img
              src="/ChatGPT%20Image%20Aug%202,%202025,%2006_25_44%20PM.png"
              alt="Signup logo"
              className="signup-logo"
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

          <button className="login-redirect" onClick={() => navigate('/')}>
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
