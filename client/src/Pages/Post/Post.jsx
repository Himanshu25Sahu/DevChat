import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaChevronDown, FaChevronUp, FaRegComment, FaShareAlt } from "react-icons/fa";
import { BiDotsVerticalRounded, BiDownload } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserId } from "../../Slices/postSlice.js";
import "./Post.css";

function Post({ postData, onLike }) {
  const [liked, setLiked] = useState(
    postData.likes.some((like) => like.user === postData.user._id)
  );
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showOptions, setShowOptions] = useState(false); // State to toggle options menu

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (showComments) {
      fetchComments();
      
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post/${postData._id}/comments`
      );
      setComments(data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post/like/${postData._id}`
      );
      setLiked(!liked);
      onLike(postData._id, data.data.likes);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post/${postData._id}/comment`,
        {
          content: newComment,
        }
      );
      setComments([...comments, data.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleHeaderClick = () => {
    dispatch(setUserId(postData.user._id));
    navigate(`/user/user-details`, { state: { user: postData.user } });
  };

  const handlePostData = () => {
    const { type, value } = postData.content;

    if (type === "text") {
      return <p>{value}</p>;
    } else if (type === "image") {
      return <img src={value} alt="Post content" className="post-image" />;
    } else if (type === "video") {
      return (
        <video controls className="post-video" autoPlay muted loop>
          <source src={value} type="video/mp4" />
        </video>
      );
    }
    return null;
  };
  const handleDownload = async () => {
    console.log(postData)
    // const { type, value } = postData.content;
    // if (!value) {
    //   console.error("No content available to download");
    //   return;
    // }

    // try {
    //   const link = document.createElement("a");

    //   if (type === "image") {
    //     link.href = value;
    //     link.download = "post_image.jpg";
    //   } else if (type === "video") {
    //     link.href = value;
    //     link.download = "post_video.mp4";
    //   }

    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);

    // } catch (error) {
    //   console.error("Error downloading file:", error);
    // }
  };

  const handleShare = async () => {
    const { type, value } = postData.content;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this post!",
          url: window.location.href,
          text: type === "text" ? value : "Check out this media!",
        });
      } else {
        alert("Sharing is not supported on your browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!postData || !postData.user || !postData.user.avatar) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="post">
      <div className="post-header">
        <div onClick={handleHeaderClick}>
          <img src={`${postData.user.avatar}`} alt="" className="post-avatar" />
          <div className="post-username">{postData.user.username}</div>
        </div>
        <div>
          <button onClick={() => setShowOptions(!showOptions)}><BiDotsVerticalRounded /></button>
          {showOptions && (
            <div className="options-menu">
              <button onClick={handleDownload} className="option-btn">
                <BiDownload /> Download
              </button>
              <button onClick={handleShare} className="option-btn">
                <FaShareAlt /> Share
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="post-content">{handlePostData()}</div>
      <div className="post-actions">
        <button onClick={handleLike} className="like-btn">
          <FaThumbsUp />
          {postData.likes.length}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="comment-btn">
          <FaRegComment />
          {/* {comments.length} */}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <img
                src={comment.owner.avatar}
                alt="avatar"
                className="comment-avatar"
              />
              <div className="comment-content">
                <span className="comment-owner">{comment.owner.username}:</span>{" "}
                {comment.content}
              </div>
            </div>
          ))}
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            <button onClick={handleAddComment} className="add-comment-btn">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
