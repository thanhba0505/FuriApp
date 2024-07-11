// utils/cloudinary.js
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { unlink } = require("../config/multer");

async function deleteAvatar(image) {
  try {
    const publicId =
      process.env.CLOUDINARY_FOLDER +
      "/avatars/" +
      image.split("/").pop().split(".")[0];

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

async function deleteBackground(image) {
  try {
    const publicId =
      process.env.CLOUDINARY_FOLDER +
      "/backgrounds/" +
      image.split("/").pop().split(".")[0];

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
      folder: process.env.CLOUDINARY_FOLDER + "/avatars",
      width: 200,
      height: 200,
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

async function uploadBackground(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_FOLDER + "/backgrounds",
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

async function uploadStory(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_FOLDER + "/stories",
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

async function uploadMultipleImages(filePaths) {
  const uploadPromises = filePaths.map(async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: process.env.CLOUDINARY_FOLDER + "uploads",
        format: "jpg",
        quality: "auto:good",
        max_file_size: "5mb",
      });
      unlink(filePath);
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
  deleteAvatar,
  uploadBackground,
  deleteBackground,
  uploadStory,
  uploadMultipleImages,
};
