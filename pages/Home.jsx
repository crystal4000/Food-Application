import React from "react";
import "../css/home.css";
import Nav from "../components/Home/Nav";
import Hero from "../components/Home/Hero";
import Footer from "../components/Home/Footer";
import Meals from "../components/Home/Meals";
import Notify from "../components/Home/Notify";

const Home = () => {
  const fadeOut = (e) => {
    const loader = e.currentTarget.nextElementSibling;
    loader.style.opacity = 0;
  };
  return (
    <div className="landing">
      <Nav />
      <Hero />
      <Meals handleLoad={fadeOut} />
      <Notify />
      <Footer />
    </div>
  );
};

export default Home;
