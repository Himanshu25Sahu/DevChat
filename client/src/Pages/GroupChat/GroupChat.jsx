import React, { useEffect, useState } from "react";
import "./GroupChat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import GroupChatBox from "./GroupChatBox";
import GroupChatConversation from "./GroupChatConversation";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiChatSmile3Line } from "react-icons/ri";
const GroupChat = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/group/getUserGroups`
        );
        setGroups(response.data.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    if (userData) {
      fetchGroups();
    }
  }, [userData]);

  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/group/search?query=${searchTerm}`
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching groups:", error);
      }
    }
  };

  return (
    <div className="GCB-chat">
      <div className="GCB-GroupChat">
        {userData ? (
          <>
            <div className="GCB-LeftSideChat">
              <div className="GCB-Container">
                <div className="GCB-LeftSideChat-top">
                  <h2>
                    <span>G</span>
                    <span>r</span>
                    <span>o</span>
                    <span>u</span>
                    <span>p</span>
                    <span>s</span>
                  </h2>

                  <div className="GCB-Search">
                    <input
                      type="text"
                      placeholder="Search for groups"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                  </div>
                </div>
                <div className="GCB-GroupList">
                  {groups.map((group) => (
                    <div key={group._id} className="GCB-GroupList-in">
                      <GroupChatConversation
                        group={group}
                        onSelect={handleGroupSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="GCB-tleft-side-chat-footer">
                <div
                  onClick={() => navigate("/chat")}
                  className="GCB-community group"
                >
                  <div className="GCB-icon-container">
                    <RiChatSmile3Line className="icon" style={{fontSize:"30px"}}/>
                  </div>
                  <div className="GCB-hover-label">Chats</div>
                </div>
                <div className="GCB-add-chat group">
                  <div
                    className="GCB-icon-container"
                    onClick={() => navigate("/addChat")}
                  >
                    <FaPlus className="icon" />
                  </div>
                  <div className="GCB-hover-label">Add Chat</div>
                </div>
              </div> 
            </div>

            <div className="GCB-RightSideChat">
              {currentGroup ? (
                <GroupChatBox group={currentGroup} />
              ) : (
                <div className="GCB-NoGroupSelected">
                  Select a group to start chatting
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GroupChat;
