// utils/cloudinary.js
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

async function uploadAvatar(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      width: 200,
      height: 200,
      crop: "fill",
      format: "jpg",
      quality: "auto:good",
      max_file_size: "2mb",
      max_files: 1,
    });

    fs.unlink(filePath, (error) => {
      if (error) {
        console.error({ error });
      }
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary:", error);
    throw error;
  }
}

async function uploadBackground(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "backgrounds",
      width: 1200,
      height: 600,
      crop: "fill",
      format: "jpg",
      quality: "auto:good",
      max_file_size: "5mb",
      max_files: 1,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading background to Cloudinary:", error);
    throw error;
  }
}

async function uploadMultipleImages(files) {
  const uploadPromises = files.map(async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: "multi_images",
        width: 800,
        height: 600,
        crop: "fill",
        format: "jpg",
        quality: "auto:good",
        max_file_size: "5mb",
      });
      return result.secure_url;
    } catch (error) {
      throw error;
    }
  });

  try {
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading multiple images to Cloudinary:", error);
    throw new Error("Failed to upload one or more images. Please try again.");
  }
}

module.exports = {
  uploadAvatar,
  uploadBackground,
  uploadMultipleImages,
};
