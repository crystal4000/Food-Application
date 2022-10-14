import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Dashboard/logo.svg";
import "../../css/sidebar.css";
import { FaHome } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { CgClose } from "react-icons/cg";

const SIdeBar = (props) => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("nav-option");
  const [sideBar, setSideBar] = useState(false);

  return (
    <nav className="nav-bar">
      <div className="nav-top">
        <div className="nav-logo">
          <img onClick={() => navigate("/")} src={logo} alt="logo" />
          <h1>Lilies</h1>
        </div>
        <button onClick={() => setSideBar(!sideBar)}>
          {sideBar ? (
            <CgClose className="hamburger" />
          ) : (
            <HiMenu className="hamburger" />
          )}
        </button>
      </div>

      <div className="none" id={sideBar ? "hidden" : ""}>
        <div
          onClick={() => {
            setActiveNav("nav-option");
          }}
          className={
            activeNav === "nav-option"
              ? "nav-option active"
              : "nav-option inactive"
          }
        >
          <FaHome className="icon" />
          <h3>Dashboard</h3>
        </div>
        <div
          onClick={() => {
            setActiveNav("profile");
            props.setProfile();
          }}
          className={
            activeNav === "profile"
              ? "nav-option active"
              : "nav-option inactive"
          }
        >
          <FaUserCircle className="icon" />
          <h3>Profile</h3>
        </div>

        <div
          onClick={() => {
            setActiveNav("order");
            props.setOrders();
          }}
          className={
            activeNav === "order" ? "nav-option active" : "nav-option inactive"
          }
        >
          <FaCalendar className="icon" />
          <h3>
            Orders <span className="order-no">{props.ordersLength}</span>
          </h3>
        </div>
        <div
          onClick={() => {
            setActiveNav("cart");
            props.cartShow();
          }}
          className={
            activeNav === "cart" ? "nav-option active" : "nav-option inactive"
          }
        >
          <FaBookmark className="icon" />
          <h3>
            Your Cart <span className="cart-no">{props.cartLength}</span>
          </h3>
        </div>
      </div>
    </nav>
  );
};

export default SIdeBar;
