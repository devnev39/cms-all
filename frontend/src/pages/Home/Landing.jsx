import React from "react";
import "../../Styles/Landing.css";
import TestimonialsSection from "./TestimonialsSection.jsx";

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Carousel Banner */}
      <div
        id="mainBanner"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="2000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="d-flex align-items-center">
              <div className="w-50 text-start ms-5 p-5 txtclr bannertxt">
                <h1>Flavours at your own pace</h1>
                <p>Enjoy delicious meals with ease.</p>
                <p>
                  <strong>Use Coupons</strong> for discounts and smooth
                  ordering!
                </p>
              </div>
              <img
                src="src/images/slide6.jpeg"
                className="d-block w-50 banner-img"
                alt="Slide 1"
              />
            </div>
          </div>

          <div className="carousel-item">
            <div className="d-flex align-items-center">
              <div className="w-50 text-start  ms-5 p-5 txtclr bannertxt">
                <h1>Fresh Ingredients Daily</h1>
                <p>Hygienic meals made with care.</p>
              </div>
              <img
                src="src/images/slide3.jpeg"
                className="d-block w-50 banner-img"
                alt="Slide 2"
              />
            </div>
          </div>

          <div className="carousel-item">
            <div className="d-flex align-items-center">
              <div className="w-50 text-start p-5 ms-5  txtclr bannertxt">
                <h1>Easy Online Orders</h1>
                <p>No cash needed. Safe and fast!</p>
              </div>
              <img
                src="src/images/slide4.jpeg"
                className="d-block w-50 banner-img"
                alt="Slide 3"
              />
            </div>
          </div>
        </div>

        {/* Left and right controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainBanner"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainBanner"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="text-white text-center p-5 hero-section">
        <h1 className="fade-in">Canteen Management System</h1>
        <p className="lead fade-in">
          Connecting Customers and Caterers — Securely and Seamlessly
        </p>
      </section>

      {/* About Section */}
      <section className="p-4 text-center txtclr">
        <h2>About the Platform</h2>
        <p>
          Our platform enables customers to place food orders and receive
          coupons instantly. Caterers get real-time order updates, secure online
          payments, and complete control over their menu.
        </p>
      </section>

      {/* Features Section */}
      <section className="p-4 bg-black text-white">
        <div className="row text-center">
          <div className="col-md-6 fade-in">
            <h3>For Customers</h3>
            <ul className="list-unstyled">
              <li>✔️ View daily or full menu</li>
              <li>✔️ Place orders with ease</li>
              <li>✔️ Receive instant coupons</li>
              <li>✔️ Buy coupons in advance</li>
            </ul>
          </div>
          <div className="col-md-6 fade-in">
            <h3>For Caterers</h3>
            <ul className="list-unstyled">
              <li>✔️ Manage menu (add/edit/delete)</li>
              <li>✔️ Track real-time orders</li>
              <li>✔️ View all order history</li>
              <li>✔️ Secure online payments</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="p-4 text-center txtclr">
        <h2>How It Works</h2>
        <ol className="text-start mx-auto" style={{ maxWidth: "600px" }}>
          <li>Customer browses the menu</li>
          <li>Places an order</li>
          <li>Receives a coupon automatically</li>
          <li>Caterer sees the order and prepares food</li>
          <li>Online payment processed securely</li>
        </ol>
      </section>

      {/* Call to Action */}
      <section className="bg-success text-white text-center p-4">
        <h2>Ready to get started?</h2>
        <button className="btn btn-light mt-3">Sign Up Now</button>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQs */}
      <section className="p-4 text-center txtclr">
        <h2>FAQs</h2>
        <div className="text-start mx-auto" style={{ maxWidth: "700px" }}>
          <p>
            <strong>Q:</strong> How do I buy coupons?
            <br />
            <strong>A:</strong> After registration, you can buy from the
            dashboard.
          </p>
          <p>
            <strong>Q:</strong> Is payment secure?
            <br />
            <strong>A:</strong> Yes, all payments are processed online securely.
          </p>
          <p>
            <strong>Q:</strong> Can I edit my order?
            <br />
            <strong>A:</strong> You can cancel and place a new order before
            preparation starts.
          </p>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="image-slider p-4 text-center">
        <div className="slider-wrapper">
          <div className="slider-track">
            {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, index) => (
              <img
                key={index}
                src={`src/images/slide${num}.jpeg`}
                alt={`Slide ${num}`}
                className="slider-img"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white pt-4">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-4 mb-3">
              <h5>About ServeEasy</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Who We Are</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Report Fraud</a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5>For Canteens</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Partner With Us</a>
                </li>
                <li>
                  <a href="#">Manage Menu</a>
                </li>
                <li>
                  <a href="#">Order Panel</a>
                </li>
                <li>
                  <a href="#">Get Paid</a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Learn More</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Security</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-3">
            <small>
              By continuing past this page, you agree to our Terms of Service,
              Cookie Policy, Privacy Policy and Content Policies.
            </small>
            <br />
            <p className="mt-2">
              © 2025 ServeEasy | Canteen Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
