import React from "react";
import { Link } from "react-router-dom";
import "./MainHome22.css";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import image from "../../public/bgrLogo.png";
import image1 from "../../public/ChatAPP.png";
import image2 from "../../public/Code.jpg";
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const MainHome = () => {
  const [text] = useTypewriter({
    words: ["Innovative...", "Efficient...", "Cutting-Edge..."],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="main-cont-hpq">
      <div className="home-slider">
        <div className="homeslider-container">
          <h1 className="text">
            <span>
              <span className="highlight" style={{color:"#7c78eb"}}>Dev</span>
              <span style={{color:"white"}}>Sphere</span>
            </span>
          </h1>
          <h2 className="subtext" style={{color:"#7c78eb"}}>
            Revolutionizing Tech with{" "}
            <span className="highlight" style={{color:"white"}}>{text}</span>
            <Cursor />
          </h2>
        </div>
      </div>

      <div className="mid-cont-h">
        {[
          {
            title: "1V1 Real-Time Chat",
            description:
              "Stay connected with your peers through seamless, real-time 1v1 chat functionality. Share ideas and collaborate instantly!",
            imgSrc: image1,
          },
          {
            title: "Community (Group Chat)",
            description:
              "Join or create groups to discuss, learn, and collaborate with others. A space for like-minded individuals to grow together.",
            imgSrc: image,
          },
          {
            title: "Post Sharing",
            description:
              "Share your thoughts, ideas, or projects with the community through posts. Engage with others' content for enhanced collaboration.",
            imgSrc: image,
          },
          {
            title: "Online Compiler",
            description:
              "Write, compile, and test your code directly within the app. No need for external IDEs, everything you need is integrated.",
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`card-cont ${index % 2 === 0 ? "card-reverse" : ""}`}
          >
            <div className="card-info">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
            </div>
            {card.imgSrc && (
              <div className="card-image">
                <img src={card.imgSrc} alt={card.title} />
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>WebSphere</h2>
            <p>
              WebSphere is your ultimate hub for coding enthusiasts. From
              real-time 1v1 chats to community discussions, posting, and an
              integrated online compiler, we empower developers with
              collaborative and innovative tools.
            </p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="#features">Features</Link>
              </li>
              <li>
                <Link to="#about">About Us</Link>
              </li>
              <li>
                <Link to="#contact">Contact</Link>
              </li>
              <li>
                <Link to="#community">Community</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
            <a
              href="https://www.instagram.com/_mushraf_jm/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com/JM-Mushraf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon github"
            >
              <FaGithub />
            </a>
              <a
              href="https://www.linkedin.com/in/mushraf-jm-386564306/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedin />
            </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 WebSphere | Designed for Coders</p>
        </div>
      </footer>
    </div>
  );
};

export default MainHome;
