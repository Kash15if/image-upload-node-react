const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
const upload = multer();

const uploadPath = "./images/";
const EventImageUploadPath = "./eventImages/";

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
/*------------------------------------ api for  profile iamges------------------------------------------------*/

/*------------------------------------                        ------------------------------------------------*/

// Create a folder for uploads if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Define routes
app.post("/images/upload", upload.single("image"), (req, res) => {
  // Save the uploaded image to the server
  const image = req.file;

  console.log(image);

  const imageFilePath = `${uploadPath}${image.originalname}`;

  console.log(imageFilePath);
  console.log(image);

  fs.writeFile(imageFilePath, image.buffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return res.status(500).send("Error saving image");
    }

    res.send("Image uploaded successfully!").status(200);
  });
});

app.get("/images/image/:filename", (req, res) => {
  // Read the image file and send it in the response
  const filename = req.params.filename;
  const imageFilePath = `${uploadPath}${filename}`;

  if (fs.existsSync(imageFilePath)) {
    const imageStream = fs.createReadStream(imageFilePath);
    res.setHeader("Content-Type", "image/jpeg"); // Set the appropriate content type based on your image type
    imageStream.pipe(res);
  } else {
    res.status(404).send("Image not found");
  }
});

app.delete("/images/image/:filename", (req, res) => {
  // Delete the image file from the server
  const filename = req.params.filename;
  console.log(filename);
  const imageFilePath = `${uploadPath}${filename}`;

  if (fs.existsSync(imageFilePath)) {
    fs.unlink(imageFilePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
        return res.status(500).send("Error deleting image");
      }

      res.send("Image deleted successfully!");
    });
  } else {
    res.status(404).send("Image not found");
  }
});

app.get("/images/files", (req, res) => {
  // Read the files from the directory
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Error reading directory" });
    }

    // Send the list of files as the response
    console.log(files);
    res.send(files);
  });
});

/*------------------------------------ api for  profile iamges closed------------------------------------------------*/

/*------------------------------------ Server called------------------------------------------------*/

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
