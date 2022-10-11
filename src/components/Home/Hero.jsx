import React from "react";
import Hero1 from "../../assets/Landing Page/hero1.svg";
import GooglePlay from "../../assets/Landing Page/googleplay.svg";
import AppStore from "../../assets/Landing Page/appstore.svg";

const Hero = () => {
  return (
    <section>
      <div className="hero">
        <div className="hero-left">
          <h1>
            Order <span>food</span> anytime, anywhere.
          </h1>

          <p className="browse">
            Browse from our list of specials to place your order and have food{" "}
            delivered to you, in no time. Affordable, tasty and fast.
          </p>
          <div className="app-btn">
            <img src={GooglePlay} alt="Google Play" />
            <img
              src={AppStore}
              alt="App Store
          "
            />
          </div>
        </div>
        <div className="hero-right">
          <img src={Hero1} alt="food" className="hero-img" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
