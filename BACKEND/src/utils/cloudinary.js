// utils/cloudinary.js
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { unlink } = require("../config/multer");

async function deleteImage(image) {
  try {
    const publicId = "uploads/" + image.split("/").pop().split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

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

    unlink(filePath);

    if (result) {
      return result.secure_url;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    unlink(filePath);
    throw error;
  }
}

async function uploadBackground(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      width: 1200,
      height: 600,
      crop: "fill",
      format: "jpg",
      quality: "auto:good",
      max_file_size: "5mb",
      max_files: 1,
    });

    unlink(filePath);

    if (result) {
      return result.secure_url;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    unlink(filePath);
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
  deleteImage,
  uploadAvatar,
  uploadBackground,
  uploadMultipleImages,
};
