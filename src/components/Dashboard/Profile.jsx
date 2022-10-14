import React from "react";
import "../../css/profile.css";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

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
            <CgClose
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
              <a
                href="https://www.linkedin.com/in/amanda-fredrick-277980248/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn className="icons linkedin" />
              </a>
            </div>
            <div className="links">
              <a
                href="https://github.com/crystal4000"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="icons github" />
              </a>
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
