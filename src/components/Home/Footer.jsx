import React from "react";
import GooglePlay from "../../assets/Landing Page/googleplay.svg";
import AppStore from "../../assets/Landing Page/appstore.svg";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { BiCopyright } from "react-icons/bi";

const footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="links">
          <h3>Company</h3>
          <p>
            <a href="/">About Us</a>
          </p>
          <p>
            <a href="/">Careers</a>
          </p>
          <p>
            <a href="/">Contact Us</a>
          </p>
        </div>
        <div className="links">
          <h3>Support</h3>
          <p>
            <a href="/">Help Center</a>
          </p>
          <p>
            <a href="/">Safety Center</a>
          </p>
        </div>
        <div className="links">
          <h3>Legal</h3>
          <p>
            <a href="/">Cookies Policy</a>
          </p>
          <p>
            <a href="/">Privacy Policy</a>
          </p>
          <p>
            <a href="/">Terms Of Service</a>
          </p>
        </div>
        <div className="links">
          <div>
            <h3>Install App</h3>
            <a href="/">
              {" "}
              <img src={GooglePlay} alt="" />
            </a>
          </div>
          <div>
            <a href="/">
              {" "}
              <img src={AppStore} alt="" />
            </a>
          </div>
        </div>
      </div>
      <hr />
      <div className="copyright">
        <p>
          <BiCopyright />
          {`${new Date().getFullYear()} Lilies. All rights reserved`}
        </p>
        <div className="socials">
          <BsInstagram className="icons" />
          <BsTwitter className="icons" />
          <BsYoutube className="icons" />
        </div>
      </div>
    </footer>
  );
};

export default footer;
