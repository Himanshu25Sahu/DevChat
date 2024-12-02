import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "./Chat Components/Chatbox";
import Conversation from "./Chat Components/Conversation";
import { io } from "socket.io-client";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi";
import Loader from "../../components/Loader/Loader";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth<=768);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  const socket = useRef();
  const { userData, token } = useSelector((state) => state.user);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobileView(window.innerWidth <= 768);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // Initialize socket connection and setup listeners
  useEffect(() => {
    console.log("chat.jsx 28", token, userData);

    if (userData && userData._id && token) {
      socket.current = io(import.meta.env.VITE_BACKEND_BASEURL, {
        query: {
          token: `Bearer ${token}`,
        },
      });

      socket.current.emit("new-user-add", userData._id);

      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });

      socket.current.on("receive-message", (data) => {
        setReceiveMessage(data);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userData, token]);

  // Fetch chats for the current user
  useEffect(() => {
    const getChats = async () => {
      if (userData && userData._id) {
        try {
          setLoading(true); // Set loading to true before fetching
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_BASEURL}/chat/chats`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setChats(data);
          console.log("chat.sjx 69 ", chats);
        } catch (error) {
          console.error("Error fetching chats:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      } else {
        setLoading(false); // Handle case where no user data exists
      }
    };
    getChats();
  }, [userData]);

  // Handle conversation click
  const handleConversationClick = (chat) => {
    setCurrentChat(chat);
  };
  useEffect(() => {
    console.log("p------- current chat", currentChat);
  }, [currentChat]);

  const handleBackToConversatoin = () => {
    setCurrentChat(null);
  };

  // Emit message when sendMessage is updated
  useEffect(() => {
    if (sendMessage && socket.current) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Handle search for people you follow
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_BASEURL
          }/following/search?username=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(data.data);
      } catch (error) {
        console.error("Error searching followed users:", error);
      }
    }
  };

  // Initiate a new chat with the selected user
  const handleNewChat = async (user) => {
    try {
      const { data: chat } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/chat/create`,
        {
          receiverId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChats((prevChats) => [...prevChats, chat]);
      setCurrentChat(chat);
      setSearchResults([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  if (loading) {
    return <Loader />; // Render Loader while loading
  }

  return (
    <div className="Chat">
      {userData ? (
        <div className="main-chat">
          <div
            className={`Left-side-chat ${
              isMobileView
                ? currentChat
                  ? "mobile-left-notsel"
                  : "mobile-left"
                : ""
            } `}
          >
            <div className="Chat-container">
              <div className="left-side-chat-top">
                <div className="head-chat-l">
                  <h2>
                    <span>C</span>
                    <span>h</span>
                    <span>a</span>
                    <span>t</span>
                    <span>s</span>
                  </h2>
                </div>
                <div className="User-search">
                  <input
                    type="text"
                    placeholder="Search people you follow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={handleSearch}>Search</button>
                </div>
                {searchResults.length > 0 && (
                  <div className="Search-results">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="Search-result-item"
                        onClick={() => handleNewChat(user)}
                      >
                        {user.username} <FaPlus className="Add-icon" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="sep-chat"></div>
              </div>

              <div className="Chat-list">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`Chat-list-in ${
                      currentChat?._id === chat._id ? "active-chat" : ""
                    }`}
                    onClick={() => handleConversationClick(chat)}
                    aria-selected={currentChat?._id === chat._id}
                  >
                    <Conversation
                      data={chat}
                      currentUserId={userData._id}
                      onlineUsers={onlineUsers}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="left-side-chat-footer">
              <div
                onClick={() => navigate("/community")}
                className="community group"
              >
                <div className="icon-container">
                  <HiUserGroup color="#7C78EB" />
                </div>
                <div className="hover-label">Communities</div>
              </div>
              <div className="group">
                <div
                  className="icon-container "
                  onClick={() => navigate("/addChat")}
                >
                  <FaPlus color="#7C78EB" />
                </div>
                <div className="hover-label">Add Chat</div>
              </div>
            </div>
          </div>

          <div
            className={`Right-side-chat ${
              isMobileView
                ? currentChat
                  ? "mobile-right"
                  : "mobile-right-notsel"
                : ""
            } `}
          >
            {currentChat ? (
              <ChatBox
                chat={currentChat}
                currentUser={userData?._id}
                setSendMessage={setSendMessage}
                receiveMessage={receiveMessage}
                onlineUsers={onlineUsers}
              />
            ) : (
              <div className="No-group-selected">
                Select a group to start chatting
              </div>
            )}
          </div>
        </div>
      ) : null}
      <FaArrowLeft color="white" onClick={handleBackToConversatoin} />
    </div>
  );
};

export default Chat;
