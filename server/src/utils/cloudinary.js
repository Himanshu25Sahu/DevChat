import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLODUINARY_CLOUD_NAME || "dqlcy9wmd",
  api_key: process.env.CLODUINARY_API_KEY || 513937327371915,
  api_secret: process.env.CLODUINARY_API_SECRET || "9XnoWAmjQOP-XhuRbT1cIEm-99c",
});

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response; 
  } catch (error) {
    fs.unlink(localFilePath);
    return null;
  }
};
const deleteFromCloudinary = async (publicId) => {
  try {
      if (!publicId) {
          return { success: false, message: "No public_id provided" };
      }

      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok") {
          return { success: true, message: "File deleted successfully from Cloudinary" };
      } else {
          return { success: false, message: "Error deleting file from Cloudinary" };
      }
  } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      return { success: false, message: "Error deleting file from Cloudinary" };
  }
};

export { uploadOnCloudinary, deleteFromCloudinary};