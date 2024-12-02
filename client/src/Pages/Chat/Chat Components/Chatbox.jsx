import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import userimg from "../../../../public/userimg.jpg";
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { IoSend } from "react-icons/io5";
import Loader from "../../../components/Loader/Loader";
import { useSelector } from "react-redux";
const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receiveMessage,
  onlineUsers,
}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true); // Loader state
  const [sending, setSending] = useState(false); // Sending state
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const {token}=useSelector((state)=>state.user)

  // Fetch user data for the chat participant
  useEffect(() => {
    const getUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      if (!userId) return;

      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
          }
        }
        );
        setUserData(data.data);
        setIsOnline(onlineUsers.some((user) => user.userId === userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (chat) getUserData();
  }, [chat, currentUser, onlineUsers]);

  // Update messages when a new message is received
  useEffect(() => {
    if (receiveMessage && receiveMessage.chatId === chat?._id) {
      setMessages((prev) => [...prev, receiveMessage]);
    }
  }, [receiveMessage, chat]);

  // Fetch all messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        if (chat?._id) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_BASEURL}/message/${chat._id}`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          }
          );
          setMessages(data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chat]);

  // Handle sending a new message
  const handleSend = async (e) => {
    e.preventDefault();

    if (sending || newMessage.trim() === "") return;

    setSending(true);
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    setMessages((prevMessages) => [...prevMessages, message]);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/message`,
        message, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      }
      );
            // Add the message from the server response, if it's not already in the list
            setMessages((prevMessages) => {
              const isMessageExist = prevMessages.some((msg) => msg._id === data._id);
              if (!isMessageExist) {
                return [...prevMessages, data];
              }
              return prevMessages;
            });
            setNewMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }

    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  // Scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderMessage = (msg) => {
    return <span>{msg.text || "Message content unavailable"}</span>;
  };

  if (loading) {
    return (
      <div className="ChatBox-container">
        <Loader /> {/* Show loader while fetching data */}
      </div>
    );
  }

  return (
    <div className="ChatBox-container">
      <div className="chat-header">
        <div className="chat-header-in">
          <div className="image-container">
            <img
              src={userData?.userdata.avatar || userimg}
              alt="User"
              className="followerImage"
            />
            <div
              className={`online-dot ${isOnline ? "online" : "offline"}`}
            ></div>
          </div>
          <div className="name">
            <span>{userData?.userdata.username || "Unknown User"}</span>
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.senderId === currentUser ? "message own" : "message"}
          >
            {renderMessage(msg)}
            <span>{format(msg.createdAt || new Date())}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-sender">
        <InputEmoji
          value={newMessage}
          onChange={setNewMessage}
          placeholder="Type a message"
        />
        <button
          className="send-button button"
          onClick={handleSend}
          disabled={newMessage.trim().length === 0 || sending}
          style={{ background: "none", cursor: sending ? "not-allowed" : "pointer" }}
        >
          <IoSend style={{ color: sending ? "#ccc" : "#7c78eb8e", fontSize: "20px" }} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;