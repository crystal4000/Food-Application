import React from "react";
import "../../css/profile.css";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const Profile = ({ show, falseProfile }) => {
  if (!show) {
    return null;
  }
  console.log(show);

  return (
    <div className="modal" onClick={falseProfile}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="close-btn">
          {
            <FaTimes
              className="close"
              onClick={() => {
                falseProfile();
              }}
            />
          }
        </div>
        <div className="modal-header">
          {/* <img src={ME} alt="profile" className="profile-img" /> */}
        </div>
        <div className="modal-body">
          <h3>Fredrick Tania-Amanda</h3>
          <div className="socials-container">
            <div className="links">
              <FaLinkedinIn className="icons linkedin" />
            </div>
            <div className="links">
              <FaGithub className="icons github" />
            </div>
          </div>
          <p className="profile-info">
            Hey there, I built this Food application to properly master the
            React javascript framework and also so showcase my skill as a
            frontend developer. I hope you have great experience as you interact
            with it ! .
          </p>

          <div className="links-container">
            <div className="links">
              <FaHtml5 className="icons html" />
            </div>
            <div className="links">
              <FaCss3Alt className="icons css" />
            </div>
            <div className="links">
              <FaReact className="icons react" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
