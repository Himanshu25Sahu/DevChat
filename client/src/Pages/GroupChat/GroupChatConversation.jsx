import React, { useEffect, useState } from "react";
import axios from "axios";
import userimg from "../../../public/userimg.jpg";
import "./GroupChatConversation.css";

const GroupChatConversation = ({ group, onSelect, selectedGroup }) => {
  const [groupData, setGroupData] = useState(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/group/${group._id}`);
        setGroupData(data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroupData();
  }, [group._id]);

  const handleClick = () => {
    onSelect(groupData); 
  };

  return (
    <div
      className={`group-conversation ${selectedGroup === groupData?.data?.name ? "group-conversation-selected" : ""}`}
      onClick={handleClick}
    >
      <div className="group-conversation-det">
        <img src={userimg} alt="" />
        <div className="group-name">
          <span>{groupData?.data?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupChatConversation;
