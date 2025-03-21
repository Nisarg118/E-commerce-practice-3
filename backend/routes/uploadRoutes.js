const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

require("dotenv").config();

const router = express.Router();

//Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not found" });
    }

    //Function to handle the stream upload to cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((result, error) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        //Use streamifier to convert file buffer to a stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    //Call the streamUpload function
    const result = await streamUpload(req.file.buffer);

    // Ensure only actual errors trigger the catch block
    if (!result || !result.secure_url) {
      throw new Error("Failed to get Cloudinary URL");
    }
    //Respond with the uploaded image URL
    res.json({ imageURL: result.secure_url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

module.exports = router;
