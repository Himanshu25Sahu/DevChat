import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../middlewares/jwtToken.js";
import { uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";
import { sendMail } from "../nodemailer/sendMail.js";
import { sendMessage } from "../nodemailer/mailMessage.js";
import mongoose from "mongoose";
//REGISTER
export const registerUser = AsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ErrorHandler("All fields are required", 400);
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ErrorHandler("Username or email already exists", 409);
  }

  const avatarFile = req.files?.avatar?.[0];
  if (!avatarFile) {
    throw new ErrorHandler("Avatar file is required", 400);
  }

  const avatar = await uploadOnCloudinary(avatarFile.path);
  if (!avatar) {
    throw new ErrorHandler("Error uploading avatar file", 500);
  }

  const verificationCode = await sendMail(email);
  req.session.verificationData = {
    username,
    email,
    password,
    avatar: { url: avatar.url, publicId: avatar.public_id },
    verificationCode,
  };

  res.status(200).json({
    success: true,
    message: "Verification code sent to your email. Please verify to complete registration.",
  });
});
export const verifyUser = AsyncHandler(async (req, res, next) => {
  const { verificationCode } = req.body;

  const verificationData = req.session.verificationData;
  if (!verificationData) {
    throw new ErrorHandler("No registration process found. Please register again.", 400);
  }

  if (verificationData.verificationCode !== Number(verificationCode)) {

    if (verificationData.avatar.publicId) {
      await deleteAvatarFromCloudinary(verificationData.avatar.publicId);
    }
    throw new ErrorHandler("Invalid verification code", 400);
  }

  const { username, email, password, avatar } = verificationData;
  const user = await User.create({
    username,
    email,
    password,
    avatar: avatar.url,
    avatarPublicId: avatar.publicId,
  });

  req.session.verificationData = null;

  const message = "Your email has been successfully verified! Welcome to DevSphere!";
  await sendMessage(email, message);

  sendToken(user, 200, res);
});


//LOGIN
// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Enter Email and password", 401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or password", 401));
    }

    const isPasswordsMatch = await user.comparePassword(password);

    if (!isPasswordsMatch) {
      return next(new ErrorHandler("Invalid Email or password", 401));
    }

    // If email and password match, send token
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        error.message || "Internal Server Error",
        error.statusCode || 500
      )
    );
  }
};

//LOGOUT
export const logout = AsyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });
  res.status(200).json(new ApiResponse(200, {}, "user LoggedOut Successfully"));
});

export const searchUser = AsyncHandler(async (req, res, next) => {
  // Only add the regex filter if username query exists and is not an empty string
  const usernameQuery = req.query.username?.trim();
  const keyword = usernameQuery
    ? {
        username: {
          $regex: usernameQuery,
          $options: "i",
        },
      }
    : null;

  try {
    // If no keyword (empty username), return an error response
    if (!keyword) {
      return res
        .status(400)
        .json(new ApiResponse(400, [], "Please provide a username to search"));
    }

    

    // Perform the search
    const users = await User.find(keyword);
    if (!users.length) {
      return res.status(404).json(new ApiResponse(404, [], "No Users Found"));
    }
    res.status(200).json(new ApiResponse(200, users, "Users Found"));
  } catch (error) {
    console.error("Error in searchUser:", error); // Log error for debugging
    return next(error);
  }
});

//GET USER DETAILS
export const getMyDetails = AsyncHandler(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }
  const userDetails = await User.aggregate([
    { $match: { _id: req.user._id } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "user",
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "following",
      },
    },
    {
      $project: {
        password: 0,
        "followers.password": 0,
        "followers.followers": 0,
        "followers.following": 0,
        "following.password": 0,
        "following.followers": 0,
        "following.following": 0,
      },
    },
  ]);

  if (!userDetails || userDetails.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const user = userDetails[0];
  
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfully with posts, followers, and following"
      )
    );
});

//get randomUserDetails
export const getUserDetails = AsyncHandler(async (req, res, next) => {
  const currentUser = req.params.id;
  if (!req.user || !currentUser) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User doesn't exist"));
  }

  const userDetails = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } }, //here I used mongoose.Types because the object Id Provied in Params are in string we have to conert externally to object id of mongoose this is done by using new mongoose.Types.ObjectId
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "user",
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "following",
      },
    },
    {
      $project: {
        password: 0,
        "followers.password": 0,
        "followers.followers": 0,
        "followers.following": 0,
        "following.password": 0,
        "following.followers": 0,
        "following.following": 0,
      },
    },
  ]);

  const userdata = userDetails[0];
  if (!userdata) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User doesn't exist"));
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userdata, currentUser },
        "User profile fetched successfully"
      )
    );
});

export const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { email, username, oldPassword, newPassword, bio } = req.body;
  let verificationRequired = false;
  if (!email && !username && !oldPassword && !newPassword && !bio) {
    throw new ErrorHandler(
      "At least one of Email, Username,Password,or bio is required"
    );
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  if (email && email !== user.email) {
    throw new ErrorHandler("Enter correct email", 401);
  }
  if (email && email === user.email) {
    verificationRequired = true;
    const verificationCode = await sendMail(user.email);
    if (!verificationCode) {
      throw new ErrorHandler("Failed to send verification email", 500);
    }
    user.verificationCode = verificationCode;
  }
  if (oldPassword && newPassword) {
    if (!oldPassword || !newPassword) {
      throw new ErrorHandler("New password cannot be empty", 400);
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new ErrorHandler(401, "Invalid Old Password");
    }
    user.password = newPassword;
    const message = "Password has been updated successfully!";
    sendMail(user.email, message);
  }
  if (username) {
    user.username = username;
  }
  if (bio) {
    user.bio = bio;
  }
  await user.save({ validateBeforeSave: true });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, verificationRequired },
        "Account details updated successfully."
      )
    );
});

export const verifyAccountChanges = AsyncHandler(async (req, res) => {
  const { verificationCode, newEmail } = req.body;
  if (!verificationCode || !newEmail) {
    throw new ErrorHandler(
      "Verification code and new email are required.",
      400
    );
  }

  const user = await User.findById(req.user?._id).select("+password");
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  if (verificationCode !== user.verificationCode.toString()) {
    throw new ErrorHandler(
      "Invalid verification code or code has expired",
      400
    );
  }

  const existedUser = await User.findOne({ email: newEmail });
  if (existedUser) {
    throw new ErrorHandler(
      "This email is already registered. Please use another email."
    );
  }

  user.email = newEmail;
  const message = "Your email has been updated successfully.";
  await sendMessage(newEmail, message); // Notify the user

  user.verificationCode = undefined;
  await user.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Account details updated successfully after verification."
      )
    );
});

export const getRecommendedUsers = AsyncHandler(async (req, res, next) => {
  const currentUserId = req.user._id;

  // Fetch the current user's following list
  const user = await User.findById(currentUserId).select("following");
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const followingList = user.following;

  // Find users followed by the people the current user follows
  const recommendedUsers = await User.aggregate([
    { $match: { _id: { $in: followingList } } }, // Find users the current user follows
    {
      $lookup: {
        from: "users", // Lookup users followed by these people
        localField: "following",
        foreignField: "_id",
        as: "recommended",
      },
    },
    { $unwind: "$recommended" }, // Flatten the recommended users array
    {
      $project: {
        _id: "$recommended._id",
        username: "$recommended.username",
        email: "$recommended.email",
        avatar: "$recommended.avatar",
      },
    },
    {
      $match: {
        _id: { $ne: currentUserId, $nin: followingList }, // Exclude the current user and their already-followed users
      },
    },
    {
      $group: {
        _id: "$_id",
        username: { $first: "$username" },
        email: { $first: "$email" },
        avatar: { $first: "$avatar" },
      },
    }, // Deduplicate
  ]);

  if (!recommendedUsers || recommendedUsers.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No recommendations found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recommendedUsers,
        "Recommended users fetched successfully"
      )
    );
});
//Update user Avatar
export const updateUserAvatar = AsyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ErrorHandler("Avatar file is missing", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ErrorHandler("Error while uploading to Cloudinary", 400);
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ErrorHandler("User doesn't exist", 404);
  }

  const oldAvatar = user.avatar;

  if (oldAvatar) {
    const imagePublicId = oldAvatar.split('/').pop().split('.')[0];
    const deleteResult = await deleteFromCloudinary(imagePublicId);

    if (!deleteResult?.success) {
      console.error("Error deleting old avatar from Cloudinary");
    }
  }

  user.avatar = avatar.url; 
  await user.save();

  res.status(200).json(new ApiResponse(200, {avatar}, "User avatar updated successfully"));
});
