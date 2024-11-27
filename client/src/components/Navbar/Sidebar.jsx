import { FaBars, FaHome, FaUser, FaCog, FaSearch } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { BiCodeAlt } from "react-icons/bi"; // Importing a new icon
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiUsers } from "react-icons/hi2";
import Logo from "../../../public/bgrLogo2.png"
import "./Sidebar.css";

const Sidebar = () => {
  const navigate=useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.user.userData);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSettingsMenu = () => setIsSettingsOpen(!isSettingsOpen);

  const handleMyProfileClick=async()=>{
    await navigate('/myProfile');
  }

  return (
    <div className="main-container">
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="top_section">
          {isOpen && <h1 className="logo">
            <span>Dev</span>
            <span>Sphere</span>
            </h1>}
          <div className="bars" onClick={toggleSidebar}>
            <FaBars />
          </div>
        </div>
        <div className="user-info">
          {user ? (
            <div className="top-sdb-in">
              <div onClick={handleMyProfileClick} className="sidebar-profile-container" >
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="user-avatar-1"
                />
              </div>
              {isOpen && <h3 className="username" onClick={handleMyProfileClick}>{user.username}</h3>}
            </div>
          ) : (
            <>
              <div></div>
              {isOpen && <h3 className="username">Login</h3>}
            </>
          )}
        </div>



        <section className="routes">
          <div className="menu">
            <Link to="/post" className="menu_item">
              <div className="icon">
                <FaHome />
              </div>
              {isOpen && <div className="link_text">Home</div>}
            </Link>
          </div>
          <div className="menu">
            <Link to="/chat" className="menu_item">
              <div className="icon">
                <MdMessage />
              </div>
              {isOpen && <div className="link_text">Chat</div>}
            </Link>
          </div>
          <div className="menu">
            <Link to="/compile" className="menu_item">
              <div className="icon">
                <BiCodeAlt />
              </div>
              {isOpen && <div className="link_text">Compile</div>}
            </Link>
          </div>
          {!user && (
            <div className="menu">
              <Link to="/login" className="menu_item">
                <div className="icon">
                  <FaUser />
                </div>
                {isOpen && <div className="link_text">Login</div>}
              </Link>
            </div>
          )}
          <div className="menu">
            <Link to="/myProfile" className="menu_item">
              <div className="icon">
                <FaUser />
              </div>
              {isOpen && <div className="link_text">My Profile</div>}
            </Link>
          </div>
          <div className="menu">
            <div className="menu_item" onClick={toggleSettingsMenu}>
              <div className="icon">
                <FaCog />
              </div>
              {isOpen && <div className="link_text">Settings</div>}
            </div>
            {isSettingsOpen && (
              <div className="submenu">
                <div className="submenu_item">
                  <Link to="/user/Edit-profile" className="link_text">
                    <div className="icon">
                      <FaUser />
                    </div>
                    Edit Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="menu">
            <Link to="/devProfile" className="menu_item">
              <div className="icon">
                <HiUsers />
              </div>
              {isOpen && <div className="link_text">Dev Profiles</div>}
            </Link>
          </div>

        </section>
        {user && (
          <div className="logout-btn">
            <Link to="/logout">
              <FiLogOut />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
