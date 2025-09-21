import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const slides = [
    { img: "/BACK1.jpg", text: "Unbeatable deals you won't find anywhere else." },
    { img: "/BACK2.jpg", text: "Top-quality products at prices made for you." },
    { img: "/BACK3.webp", text: "Secure, reliable, and trusted service every time." },
    { img: "/BACK4.jpg", text: "Everything you need—delivered with value and care." },
  ];

  const [current, setCurrent] = useState(0);
  const [userName, setUserName] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUserName(storedUser.name || storedUser.email);

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-wrapper">
      <div
        className="hero"
        style={{
          backgroundImage: `url(${slides[current].img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="hero-text">
          {showWelcome && userName ? (
            <h1>Welcome back, {userName}! ⚔️</h1>
          ) : (
            <h1>{slides[current].text}</h1>
          )}

          <Link to="/products" className="start-shopping-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
