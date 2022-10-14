import React from "react";
import { useState } from "react";
import logo from "../../assets/Landing Page/logo.svg";
import { HiMenu } from "react-icons/hi";
import { CgClose } from "react-icons/cg";

const Nav = () => {
  const [showLinks, setShowLinks] = useState(false);

  return (
    <nav className="navBar">
      <div className="nav-brand">
        <a href="/">
          <img src={logo} alt="logo" />
          <p>Lilies</p>
        </a>
      </div>
      <div className="nav-links">
        <div className="links" id={showLinks ? "hidden" : ""}>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li className="signup-btn">
              <a href="/signup">Signup</a>
            </li>
          </ul>
        </div>
        {/* <button onClick={() => setShowLinks(!showLinks)}>Open</button> */}
        <button onClick={() => setShowLinks(!showLinks)}>
          {/* <HiMenu className="hamburger" /> */}
          {showLinks ? (
            <CgClose className="hamburger" />
          ) : (
            <HiMenu className="hamburger" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
