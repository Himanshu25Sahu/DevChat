import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import "./AddFriend.css";
import toast from "react-hot-toast";

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [followersList, setFollowersList] = useState([]); // Followers list from user data
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchUserFollowers();
  }, []);

  const fetchUserFollowers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/me`);
      const followers = data.data.followers; // Array of follower objects with `_id` and `username`

      // Map to extract relevant fields for display
      const followerDetails = followers.map((follower) => ({
        _id: follower._id,
        username: follower.username,
      }));

      setFollowersList(followerDetails);
    } catch (error) {
      console.error("Error fetching followers list:", error);
      toast.error("Failed to fetch followers list.");
    }
  };

  // Handle user search
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/user/search-user?username=${searchTerm}`
        );
        setSearchResults(data.data); // Update user search results
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
  };

  // Handle group search
  const handleGroupSearch = async () => {
    if (groupSearchTerm) {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/group/search?query=${groupSearchTerm}`
        );
        setGroupSearchResults(data.data); // Update group search results
      } catch (error) {
        console.error("Error searching groups:", error);
        toast.error("Failed to search for groups.");
      }
    }
  };

  // Handle following a user
  const handleFollow = async (userId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_BASEURL}/follow/${userId}`);
      await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/chat/create`, {
        receiverId: userId,
      });
      toast.success("User followed successfully!");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error(error.response?.data?.error || "Error following user");
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/group/join`, { groupId });
      toast.success("Successfully joined the group!");
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error(error.response?.data?.message || "Error joining group");
    }
  };

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription || selectedMembers.length < 1) {
      toast.error("Please fill all fields and select at least one additional member.");
      return;
    }
  
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/group/create`, {
        name: groupName,
        description: groupDescription,
        members: selectedMembers, // Send selected members only; backend adds the current user
      });
      toast.success("Group created successfully!");
      // Clear form fields after successful group creation
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Error creating group");
    }
  };
  
  // Handle selecting members
  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(memberId)
        ? prevMembers.filter((id) => id !== memberId)
        : [...prevMembers, memberId]
    );
  };

  return (
    <div className="Search-container">
      <div className="Left-column">
        <div className="User-search">
          <h3>Search Users</h3>
          <input
            type="text"
            placeholder="Search users by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch} className="btn-c">Search Users</button>
          {searchResults.length > 0 && (
            <div className="Search-results">
              {searchResults.map((user) => (
                <div key={user._id} className="Search-result-item">
                  <img
                    src={user.avatar || "default-avatar.png"}
                    alt={`${user.username}'s avatar`}
                  />
                  <span>{user.username}</span>
                  <FaPlus
                    onClick={() => handleFollow(user._id)}
                    className="FaPlus"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Group Search */}
        <div className="Group-search">
          <h3>Search Groups</h3>
          <input
            type="text"
            placeholder="Search groups by name or description"
            value={groupSearchTerm}
            onChange={(e) => setGroupSearchTerm(e.target.value)}
          />
          <button onClick={handleGroupSearch} className="btn-c">Search Groups</button>
          {groupSearchResults.length > 0 && (
            <div className="Search-results">
              {groupSearchResults.map((group) => (
                <div key={group._id} className="Search-result-item">
                  <span>{group.name}</span>
                  <FaPlus
                    onClick={() => handleJoinGroup(group._id)}
                    className="FaPlus"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Right Column */}
      <div className="Right-column">
        {/* Group Creation */}
        <h3>Create New Group</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <textarea
          placeholder="Group Description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          className="text-area-c"
        />
        
        <div className="Followers-list">
          <div className="f-list">
          {followersList.map((follower) => (
            <div key={follower._id} className="Follower-item">
              <input
                type="checkbox"
                checked={selectedMembers.includes(follower._id)}
                onChange={() => handleMemberSelect(follower._id)}
              />
              <label>{follower.username}</label>
            </div>
          ))}
          </div>
        </div>
  
        <button onClick={handleCreateGroup} className="btn-c">Create Group</button>
      </div>
    </div>
  );
  
};

export default AddFriend;
