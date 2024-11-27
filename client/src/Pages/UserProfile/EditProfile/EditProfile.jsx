import React, { useState } from "react";
import axios from "axios";
import "./EditProfile.css";
import { FcCdLogo } from "react-icons/fc";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [bio, setBio] = useState(""); // Added state for bio
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [serverCode, setServerCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sCode, setsCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(oldPassword && newPassword && { oldPassword, newPassword }),
      ...(bio && { bio }), // Add bio to the formData
    };

    if (email) {
      setIsVerificationRequired(true);
    }
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/user/updateAccount", formData);
      const { data } = response;
      if (email) {
        setIsVerificationRequired(true);
      }
      setsCode(response.data.data.user.verificationCode);
      if (data.verificationRequired) {
        setIsVerificationRequired(true);
        setServerCode(data.user.verificationCode);
      } else {
        setMessage(data.message || "Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
      if (email) {
        setIsVerificationRequired(true);
      }
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode === sCode.toString()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/user/verification",
          { verificationCode, newEmail }
        );
  
        const { data } = response;
        if (data) {
          alert(data.message || "Email verified successfully!");
          setIsVerificationRequired(false);
          setMessage(data.message);
        } else {
          console.log("No response from server during verification");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        alert("Failed to verify email. Please try again.");
      }
    } else {
      alert("Invalid verification code. Please try again.");
    }
  };
  

  return (
    <div className="main-cont-edit">
    <div className="edit-profile-container">
      <h2> 
        <span>Edit</span>
        <span>Profile</span>
      </h2>

      {message && <p className="success-message">{message}</p>}

      {!isVerificationRequired && (
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="username">
            <span className="icon">👤</span>
            <span className="icon-t">Username</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
            <span className="icon">📧</span> 
            <span className="icon-t">Email</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter current email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="oldPassword">
            <span className="icon">🔒</span>
            <span className="icon-t">Current Password</span>
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
            <span className="icon">🔒</span>
            <span className="icon-t">New Password</span>
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          {/* Bio Section */}
          <div className="form-group">
            <label htmlFor="bio">
            <span className="icon">✏️</span>
            <span className="icon-t">Bio</span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>

          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {isVerificationRequired && (
        <div className="verification-form">
          <h3>Verify Email</h3>
          <div className="form-group">
            <label htmlFor="verificationCode">Enter Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newEmail">Enter New Email</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
          </div>
          <button
            onClick={handleVerificationSubmit}
            className="verify-button"
            disabled={!verificationCode || !newEmail}
          >
            Verify
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default EditProfile;