import React, { useState, useEffect } from "react";
import Feed from "./components/Feed";
import CreatePost from "./components/CreatePost";
import Sidebar from "./components/Sidebar"; // Import Sidebar

const App = () => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [view, setView] = useState("home"); // 👈 New state to manage views
  const [showClearFeedModal, setShowClearFeedModal] = useState(false); // Modal state

  // ✅ Load posts from localStorage on mount
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

  // ✅ Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ✅ Function to handle post creation
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => {
      const updatedPosts = [newPost, ...prevPosts];
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });

    setShowCreatePost(false);
  };

  // ✅ Toggle Like
  const handleLikePost = (post) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((p) =>
        p.id === post.id ? { ...p, liked: !p.liked } : p
      );
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  // ✅ Toggle Save
  const handleSavePost = (post) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((p) =>
        p.id === post.id ? { ...p, saved: !p.saved } : p
      );
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  // ✅ Delete Post
  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.filter((post) => post.id !== postId);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  // ✅ Handle Clear Feed Confirmation
  const handleClearFeed = () => {
    setShowClearFeedModal(true);
  };

  const confirmClearFeed = () => {
    localStorage.removeItem("posts");
    setPosts([]);
    setShowClearFeedModal(false);
  };

  const cancelClearFeed = () => {
    setShowClearFeedModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* ✅ Sidebar with Navigation Buttons */}
      <Sidebar 
        onCreatePost={() => setShowCreatePost(true)} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        setView={setView} 
      />

      {/* ✅ Main Feed Section */}
      <div className="w-3/4 p-6 overflow-y-auto">
        {/* First Header: Always "Flick" */}
        <h1 className="text-4xl font-bold text-center" style={{ color: "#2A2D34" }}>
          Flick
        </h1>

        <Feed 
          posts={posts}  
          onLikePost={handleLikePost}  
          onSavePost={handleSavePost}  
          onDeletePost={handleDeletePost}  
          onClearFeed={handleClearFeed}  
          view={view}
        />
      </div>

      {/* ✅ Show CreatePost as a Full-Screen Modal */}
      {showCreatePost && <CreatePost onPostCreated={handlePostCreated} onClose={() => setShowCreatePost(false)} />}

      {/* ✅ Modal for "Clear Feed" Confirmation */}
      {showClearFeedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md text-center border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900">Confirm Deletion</h2>
            <p className="text-gray-700 mt-2">Are you sure you want to delete all your posts?</p>

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={confirmClearFeed}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition duration-300"
              >
                Yes, Delete
              </button>

              <button
                onClick={cancelClearFeed}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
