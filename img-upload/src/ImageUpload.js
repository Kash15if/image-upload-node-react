import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ImageUpload.css"; // Import your CSS file

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/images/files") // Replace with your API endpoint
      .then((response) => {
        console.log(response);
        setUploadedImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/images/files"); // Replace with your API endpoint

      console.log(response);
      setUploadedImages(response.data);
    } catch (error) {
      console.log(error);
      console.error("Error fetching images:", error);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleDelete = async (imageId) => {
    try {
      await axios.delete(`http://localhost:3000/images/image/${imageId}`); // Replace with your delete API endpoint
      setUploadMessage("Image deleted successfully.");
      fetchImages(); // Fetch images again after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      console.log("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:3000/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadMessage("Image uploaded successfully!");
      setSelectedImage(null);
      fetchImages(); // Fetch images again after upload
      console.log("Image uploaded:", response.data);
    } catch (error) {
      setUploadMessage("Error uploading image.");
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Image Upload</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
      {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
      <div className="uploaded-images">
        <table>
          <tr>
            <th>image url</th>
            <th>image</th>
            <th>action</th>
          </tr>
          {uploadedImages &&
            uploadedImages.map((image, index) => (
              <tr>
                <td>{`http://localhost:3000/images/image/${image}`}</td>
                <td>
                  <img
                    src={`http://localhost:3000/images/image/${image}`}
                    alt={`Uploaded ${image}`}
                    height={300}
                    width={400}
                  />
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(image)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
}

export default ImageUpload;
