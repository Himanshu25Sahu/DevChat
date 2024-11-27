import React, { useEffect, useState } from "react";
import axios from "axios";
import userimg from "../../../../public/userimg.jpg";
import Loader from "../../../components/Loader/Loader";
import "./Conversation.css";

const Conversation = ({ data, currentUserId, onClick, onlineUsers }) => {
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const userId = data.members.find((id) => id !== currentUserId);
        const { data: user } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/${userId}`);
        setUserData(user.data);
        setIsOnline(onlineUsers.some((user) => user.userId === userId));
      } catch (error) {
        console.error("Error fetching conversation user data:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };
    fetchUserData();
  }, [data, currentUserId, onlineUsers]);

  const handleClick = () => {
    setSelectedChat(userData?.userdata.username); 
    // onClick(userData); 
  };

  if (loading) {
    return (
      <div className="conv-loader-wrapper">
        <Loader /> {/* Display the loader while loading */}
      </div>
    );
  }

  return (
    <div
      className={`conv-follower conv-conversation ${
        selectedChat === userData?.userdata.username ? "conv-selected" : ""
      }`}
      onClick={handleClick}
    >
      <div className="conv-list">
        <div>
          <div className="conv-img-wrapper">
            <img src={userData?.userdata.avatar || userimg} alt="" className="conv-followerImage" />
            <div className={`conv-online-dot ${isOnline ? "conv-online" : "conv-offline"}`}></div>
          </div>
          <div className="conv-name">
            <span>{userData?.userdata.username || "Unknown User"}</span>
          </div>
        </div>
        <div className="conv-on-s">
          <span className={isOnline ? "Online-s" : "Offline-s"}>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
