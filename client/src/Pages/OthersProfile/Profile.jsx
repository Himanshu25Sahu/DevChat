import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import "./profile.css";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";

const Profile = () => {
  const userId = useSelector((state) => state.post.userId); // Replace `state.post.userId` if userId is stored elsewhere

  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("No bio available");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available");
      setError("User ID is not available.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching data

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/user/${userId}`
        );

        const userData = response.data?.data?.userdata;

        if (userData) {
          setAvatar(userData.avatar || "");
          setUserName(userData.username || "No Name");
          setBio(userData.bio || "No bio available");
          setPosts(userData.posts || []);
          setFollowers(userData.followers || []);
          setFollowing(userData.following || []);
        } else {
          console.error("User data is missing.");
          setError("User data is not available.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <Loader />; // Display a loader while data is being fetched
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message if fetching fails
  }

  return (
    <div className="profile-container">
      <div className="profile-header-section">
        <div className="user-avatar">
          <img
            src={avatar || "/default-avatar.png"} // Fallback to a default avatar
            alt={`${userName}'s Avatar`}
            onError={(e) => (e.target.src = "/default-avatar.png")} // Handle broken image URLs
          />
        </div>
        <div className="user-profile-info">
          <h2>{userName}</h2>
          <div className="stats-container">
            <span>
              <strong>{posts.length}</strong> Posts
            </span>
            <span>
              <strong>{followers.length}</strong> Followers
            </span>
            <span>
              <strong>{following.length}</strong> Following
            </span>
          </div>
          <p className="user-bio">{bio}</p>
        </div>
      </div>
      <div className="edit-profile-section">
        <button>Message {userName}</button>
      </div>
      <div className="user-posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="user-post-item">
              {post.content.type === "image" ? (
                <img
                  src={post.content.value}
                  alt="Post Image"
                  onError={(e) => (e.target.src = "/default-post-image.png")} // Fallback for broken images
                />
              ) : post.content.type === "video" ? (
                <video controls src={post.content.value}></video>
              ) : (
                <p>{post.content.value}</p>
              )}
              <div className="post-overlay">
                <div className="overlay-info-container">
                  <span>
                    <FaHeart /> {post.likes.length}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
