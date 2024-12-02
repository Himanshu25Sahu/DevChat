import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPencilAlt } from "react-icons/fa";
import "./Register.css";
import DefaultAvatar from "../../../public/userimg.jpg";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
  const [step, setStep] = useState(1); 
  const [verificationCode, setVerificationCode] = useState("");
  const [isloading, setIsLoading]=useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!avatar) {
      toast.error("Please upload an avatar.");
      return;
    }

    const completeData = new FormData();
    completeData.append("username", formData.username);
    completeData.append("email", formData.email);
    completeData.append("password", formData.password);
    completeData.append("avatar", avatar);

    try {
      setIsLoading(true);
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/user/register`,
        completeData,{ withCredentials: true } 
      );
      if (result.data.success) {
        setIsLoading(false);
        toast.success("Verification code sent to your email.");
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
      console.error("REGISTER ERROR: ", err);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/user/register/verification`,
        {
          verificationCode,
        },{ withCredentials: true } 
      );
      console.log(result.data)
      if (result.data.success) {
        setIsLoading(false);
        toast.success("Registration successful. Please log in.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
      console.error("VERIFICATION ERROR: ", err);
    }
  };

  return (
    <div className="register">
     {isloading ? <Loader style={{ zIndex: 10000 }} /> : ""}
      {step === 1 && (
        <div className="reg-main-reg-cont">
          <div className="reg-avatar-section">
            <div className="reg-avatar-wrapper">
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="reg-avatar-preview"
              />
              <label htmlFor="avatarInput" className="reg-avatar-upload-label">
                <FaPencilAlt className="reg-avatar-pencil" />
              </label>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                onChange={handleAvatarChange}
                className="reg-avatar-input"
              />
            </div>
          </div>
          <div className="reg-register-container">
            <h2 className="reg-register-title">
              <span>Regi</span>
              <span>ster</span>
            </h2>
            <form onSubmit={handleRegister} className="reg-register-form">
              <div className="reg-form-group">
                <label>
                  <span className="icon">👤</span>
                  <span className="icon-t">Username</span>
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  className="reg-register-input"
                />
              </div>
              <div className="reg-form-group">
                <label>
                  <span className="icon">📧</span>
                  <span className="icon-t">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="reg-register-input"
                />
              </div>
              <div className="reg-form-group">
                <label>
                  <span className="icon">🔒</span>
                  <span className="icon-t">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="reg-register-input"
                />
              </div>
              <button type="submit" className="reg-register-button">
                Register
              </button>
              <div className="reg">
                <span>Already have an account? </span>
                <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="reg-main-reg-cont">
          <div className="reg-register-container">
            <h2 className="reg-register-title">
              <span>Email</span>
              <span> Verification</span>
            </h2>
            <form onSubmit={handleVerifyCode} className="reg-register-form">
              <div className="reg-form-group">
                <label>
                  <span className="icon">🔑</span>
                  <span className="icon-t">Verification Code</span>
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter the code sent to your email"
                  required
                  className="reg-register-input"
                />
              </div>
              <button type="submit" className="reg-register-button">
                Verify
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
