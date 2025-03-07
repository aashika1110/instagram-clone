import React from "react";
import { FaPlus, FaHome, FaBookmark, FaHeart } from "react-icons/fa";

const Sidebar = ({ onCreatePost, setView, view }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "saved", label: "Saved Posts", icon: <FaBookmark /> },
    { id: "liked", label: "Liked Posts", icon: <FaHeart /> },
  ];

  return (
    <div className="w-[22%] h-screen p-6 shadow-md flex flex-col justify-between items-center transition duration-300 bg-[#2A2D34]">
      
      {/* ✅ Logo */}
      <h1 className="text-3xl font-bold text-white mt-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
        Flick
      </h1>

      {/* ✅ Sidebar Navigation - Centered */}
      <div className="flex flex-col items-center w-full mt-auto mb-auto">
        {menuItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex items-center gap-3 py-2 px-4 mb-4 w-full rounded-md transition
              ${view === id ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700"}`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ✅ Create Post Button - At the Bottom */}
      <button
        onClick={onCreatePost}
        className="bg-[#4F8EF7] hover:bg-[#3C76D2] text-white font-semibold px-5 py-3 rounded-md w-full flex items-center justify-center gap-2 transition duration-300 mt-auto"
      >
        <FaPlus /> Create Post
      </button>
    </div>
  );
};

export default Sidebar;
