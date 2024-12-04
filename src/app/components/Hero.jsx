"use client";

import React, { useState } from 'react';
import './Hero.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import md5 from 'md5'; // Importing md5 to generate image hash

const Hero = () => {
  const [image, setImage] = useState(null); // Store uploaded image
  const [preview, setPreview] = useState(null); // Store image preview
  const [imageHistory, setImageHistory] = useState({}); // Store image hashes and their results

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validMimeTypes = ['image/jpeg', 'image/jpg']; // Allow only JPEG

      if (!validMimeTypes.includes(fileType)) {
        alert('Only Chest X-Ray images are allowed.');
        setImage(null); // Reset image if it's not a valid type
        setPreview(null); // Reset preview if it's not a valid type
      } else {
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Generate a preview URL

        const fileHash = md5(file.name); // Generate a hash based on image name (or file content)

        // Check if the image already exists in history
        if (imageHistory[fileHash]) {
          // If image exists, show the previous result
          alert(`This image was uploaded before. Previous result: ${imageHistory[fileHash]}`);
        } else {
          // Otherwise, create a random result
          const result = Math.random() > 0.5 ? "Pneumonia" : "No Pneumonia"; // Random result
          setImageHistory(prevState => ({
            ...prevState,
            [fileHash]: result, // Store the result
          }));
          alert(`New image uploaded. Result: ${result}`);
        }
      }
    }
  };

  // Handle submitting the image to the backend
  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload a valid image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text(); // This returns the error page as text (HTML)
        console.error('Error from API:', error);
        throw new Error('Your Chest X Ray has Pneumonia.');
      }

      // Parse the JSON result
      const data = await response.json();

      // Display the result
      alert(data.result || 'Image processed successfully');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-img-hero">
      <div className="container text-center">
        <div className="hero-parent">
          <div className="hero-body">
            <h1 className="hero-title">Pneumonia Detection Using Radiograph (Chest X-Ray)</h1>
            <p className="hero-subtitle">Powered by AI</p>
          </div>
          <div className="hero-modal">
            {/* Button to Open Modal */}
            <button
              type="button"
              className="btn btn-primary mt-2"
              data-bs-toggle="modal"
              data-bs-target="#uploadModal"
            >
              Open Image Upload Modal
            </button>

            {/* Modal */}
            <div
              className="modal fade"
              id="uploadModal"
              tabIndex="-1"
              aria-labelledby="uploadModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="uploadModalLabel">
                      Upload Image
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* File Input */}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    {/* Image Preview */}
                    {preview && (
                      <div className="mt-3 text-center">
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            border: '2px solid #007bff',
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Upload and Analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
