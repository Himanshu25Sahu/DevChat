import React from "react";
import "./DevProfile.css";
import { FaInstagram, FaLinkedin, FaGithub, FaArrowDown } from "react-icons/fa"; // Import the arrow icon
import Himanshu from "../../../public/Himanshu.png";
import Mushraf from "../../../public/Mushraf.jpg";

const DevProfile = () => {
  return (
    <div className="dev-profile-page">
      <div className="dev-profile-card">
        <div className="dev-info">
          <img src={Mushraf} alt="Developer 1" className="dev-image" />
          <h2 className="dev-name">JM Mushraf</h2>
          <p className="dev-role">Full-stack Developer (MERN)</p>
          <p className="dev-description">
            Passionate about building full-stack applications, from front-end
            interfaces to back-end services. Skilled in creating user-friendly
            designs and handling server-side logic with technologies like
            MongoDB, Express, React, and Node.js.
          </p>

          <div className="dev-projects">
            <h3 className="dev-section-title">Projects</h3>
            <ul className="dev-list">
              <li>Coride: A ride-sharing app for travelers.</li>
              <li>
                WebSphere: A platform designed for coders to collaborate, share,
                and manage their coding projects efficiently.
              </li>
            </ul>
            <div className="sep11"></div>
            <h3 className="dev-section-title">Internships</h3>
            <ul className="dev-list">
              <li>Cropnow: Full-stack Developer Intern (4 months).</li>
            </ul>
            <div className="scroll-indicator">
              <FaArrowDown />
            </div>
          </div>
          <div className="dev-social-links">
            <a
              href="https://www.instagram.com/_mushraf_jm/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/mushraf-jm-386564306/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/JM-Mushraf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon github"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="dev-profile-card">
        <div className="dev-info">
          <img src={Himanshu} alt="Developer 1" className="dev-image" />
          <h2 className="dev-name">Himanshu Sahu</h2>
          <p className="dev-role">Full-stack Developer (MERN)</p>
          <p className="dev-description">
            I’m a skilled full-stack developer with expertise in the MERN stack,
            passionate about creating efficient web applications. Currently, I’m
            diving into machine learning to broaden my knowledge and explore new
            possibilities in tech.
          </p>
          <div className="dev-projects">
            <h3 className="dev-section-title">Projects</h3>
            <ul className="dev-list">
              <li>Coride: A ride-sharing app for travelers.</li>
              <li>
                GemiCook: A Simple Solutions to find your receipes and make one.
              </li>
            </ul>
            <div className="sep11"></div>

            <div className="scroll-indicator">
              <FaArrowDown />
            </div>
          </div>
          <div className="dev-social-links">
            <a
              href="https://www.instagram.com/hi_ma_n_sh_u/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/himanshu-sahu-303b2b25a/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/Himanshu25Sahu"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon github"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevProfile;
