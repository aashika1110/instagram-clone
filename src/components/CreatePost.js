import React, { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Cropper from "react-easy-crop";
import { FaTimes, FaArrowLeft } from "react-icons/fa";

const CreatePost = ({ onPostCreated, onClose }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Image Upload (File)
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
      setPreview(e.target.result);
      setIsCropping(true);
    };

    reader.onerror = () => {
      alert("Error loading image. Please try a different file.");
    };

    reader.readAsDataURL(file);
  };

  // Handle Image URL Input
  const handleImageUrlInput = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview("");

    const img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous"; // Avoid CORS issues

    img.onload = () => {
      setPreview(url);
      setIsCropping(true);
    };

    img.onerror = () => {
      alert("Failed to load image. Try another URL.");
    };
  };

  // Handle Crop Completion
  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropAreaPixels(croppedAreaPixels);
  }, []);

  // Create Cropped Image
  const createCroppedImage = async () => {
    return new Promise((resolve, reject) => {
      if (!preview) {
        alert("No image available for cropping.");
        reject("No image to crop.");
        return;
      }

      const image = new Image();
      image.src = preview;
      image.crossOrigin = "anonymous";

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const targetWidth = 400;
        const targetHeight = 500;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        if (!cropAreaPixels) {
          alert("Crop area is not set. Please adjust the crop box.");
          reject("Crop area missing.");
          return;
        }

        ctx.drawImage(
          image,
          cropAreaPixels.x, cropAreaPixels.y, cropAreaPixels.width, cropAreaPixels.height,
          0, 0, targetWidth, targetHeight
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };

      image.onerror = () => {
        alert("Error loading image. Please try again.");
        reject("Image load error.");
      };
    });
  };

  // Confirm Cropped Image
  const handleDoneCropping = async () => {
    if (!cropAreaPixels) {
      alert("Please adjust the crop area before clicking 'Done Cropping'.");
      return;
    }

    const croppedImg = await createCroppedImage();
    if (!croppedImg) {
      alert("Error processing cropped image. Try again.");
      return;
    }

    setCroppedImage(croppedImg);
    setPreview(croppedImg);
    setIsCropping(false);
  };

  // Handle Posting
  const handlePost = () => {
    if (!croppedImage || !caption.trim()) {
      alert("Please crop the image and add a caption before posting.");
      return;
    }

    const newPost = {
      id: uuidv4(),
      image: croppedImage,
      caption,
      timestamp: new Date().toLocaleString(),
      liked: false,
      saved: false,
    };

    // Update posts in localStorage
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedPosts = [newPost, ...storedPosts];

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // Update state in App component
    onPostCreated(newPost);

    // Clear Input Fields After Posting
    setCaption("");
    setCroppedImage(null);
    setPreview("");
    setIsCropping(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        
        {/* Close & Back to Feed Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-gray-600 text-lg flex items-center gap-2 hover:text-gray-900 transition">
            <FaArrowLeft /> Back to Feed
          </button>

          <button onClick={onClose} className="bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:scale-110 transition">
            <FaTimes />
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Create a Post</h2>

        {/* Image URL Input */}
        <input
          type="text"
          placeholder="Paste an Image URL"
          className="border border-gray-300 p-3 w-full rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          value={imageUrl}
          onChange={handleImageUrlInput}
        />

        {/* File Upload Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="border border-gray-300 p-3 w-full rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleImageUpload}
        />

        {/* Cropping Section */}
        {preview && isCropping && (
          <div className="relative w-full h-64 bg-black flex flex-col items-center justify-center mt-3">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={4 / 5}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              cropShape="rect"
              showGrid={true}
            />

            {/* Zoom Slider */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full bg-gray-200 rounded-lg overflow-hidden appearance-none"
              />
            </div>

            {/* Done Cropping Button */}
            <button
              onClick={handleDoneCropping}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Done Cropping
            </button>
          </div>
        )}

        {/* Cropped Image Preview */}
        {croppedImage && <img src={croppedImage} alt="Cropped Preview" className="w-full mt-3 rounded-md shadow-md" />}

        {/* Caption Input */}
        <input
          type="text"
          placeholder="Write a caption..."
          className="border border-gray-300 p-3 w-full mt-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Post Button */}
        <button onClick={handlePost} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-3 mt-4 rounded-md w-full transition duration-300">
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
