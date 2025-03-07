import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  FaHeart, FaRegHeart, FaTrash, FaArrowLeft, 
  FaArrowRight, FaTimes, FaBookmark, FaRegBookmark 
} from "react-icons/fa";

const Feed = ({ posts, onClearFeed, view, onLikePost, onSavePost, onDeletePost }) => {
  const [postList, setPostList] = useState(posts);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  // ✅ Update postList when view changes or posts are updated
  useEffect(() => {
    if (view === "saved") {
      setPostList(posts.filter((post) => post.saved));
    } else if (view === "liked") {
      setPostList(posts.filter((post) => post.liked));
    } else {
      setPostList(posts);
    }
  }, [view, posts]);

  // ✅ Reset selectedPostIndex if the post is deleted
  useEffect(() => {
    if (selectedPostIndex !== null && selectedPostIndex >= postList.length) {
      setSelectedPostIndex(null);
    }
  }, [postList]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {view === "saved" ? "Saved Posts" : view === "liked" ? "Liked Posts" : "Your Feed"}
        </h2>

        {postList.length > 0 && view !== "saved" && (
          <button
            onClick={onClearFeed}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Clear Feed
          </button>
        )}
      </div>

      {postList.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          {view === "saved"
            ? "No saved posts yet."
            : view === "liked"
            ? "You haven't liked any posts yet."
            : "No posts yet. Create one!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {postList.map((post, index) => (
            <div key={index} className="flex flex-col items-center cursor-pointer">
              <div className="w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition">
                {/* ✅ Fix Image Centering */}
                <div className="w-full h-[300px] overflow-hidden bg-transparent flex justify-center items-center">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-full object-cover object-center rounded-lg" 
                    style={{ objectFit: "cover", objectPosition: "center" }} 
                    onClick={() => setSelectedPostIndex(index)} 
                  />
                </div>
              </div>

              {/* Caption and Date */}
              <p className="mt-3 text-lg font-semibold text-gray-800">{post.caption}</p>
              <p className="text-sm text-gray-500">
                {post.timestamp && !isNaN(new Date(post.timestamp).getTime())
                  ? format(new Date(post.timestamp), "dd MMMM, yyyy, h:mm a")
                  : format(new Date(), "dd MMMM, yyyy, h:mm a")} {/* ✅ Fallback to current date */}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Full Post View */}
      {selectedPostIndex !== null && postList[selectedPostIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-6">
          <div className="bg-white p-4 rounded-xl shadow-xl max-w-lg w-[400px] flex flex-col justify-between border border-gray-300">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPostIndex(null)}
              className="absolute top-3 right-3 bg-gray-700 text-white p-2 rounded-full shadow-md hover:scale-110 transition duration-200 z-50"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Image Navigation */}
            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={() => setSelectedPostIndex(selectedPostIndex > 0 ? selectedPostIndex - 1 : postList.length - 1)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg bg-white shadow-md rounded-full p-2 hover:scale-110 transition"
              >
                <FaArrowLeft />
              </button>

              {/* ✅ Fix Image in Full Post View */}
              <div className="flex-grow flex justify-center items-center max-h-[400px]">
                <img
                  src={postList[selectedPostIndex].image}
                  alt="Post"
                  className="w-[350px] h-[400px] object-cover object-center rounded-lg"
                />
              </div>

              <button
                onClick={() => setSelectedPostIndex(selectedPostIndex < postList.length - 1 ? selectedPostIndex + 1 : 0)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg bg-white shadow-md rounded-full p-2 hover:scale-110 transition"
              >
                <FaArrowRight />
              </button>
            </div>

            {/* Caption & Date */}
            <div className="w-full text-center p-2 bg-white shadow-md border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-800 truncate">
                {postList[selectedPostIndex].caption}
              </p>
              <p className="text-sm text-gray-500">
                {postList[selectedPostIndex] &&
                postList[selectedPostIndex].timestamp &&
                !isNaN(new Date(postList[selectedPostIndex].timestamp).getTime())
                  ? format(new Date(postList[selectedPostIndex].timestamp), "dd MMMM, yyyy, h:mm a")
                  : "Unknown Date"}
              </p>
            </div>

            {/* Like, Save & Delete Buttons */}
            <div className="w-full flex justify-between items-center px-6 py-2 bg-white shadow-md border-t border-gray-200">
              <button onClick={() => onLikePost(postList[selectedPostIndex])}>
                {postList[selectedPostIndex].liked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" />
                )}
              </button>

              <button onClick={() => onSavePost(postList[selectedPostIndex])}>
                {postList[selectedPostIndex].saved ? (
                  <FaBookmark className="text-yellow-500" />
                ) : (
                  <FaRegBookmark className="text-gray-500" />
                )}
              </button>

              <button
                onClick={() => onDeletePost(postList[selectedPostIndex].id)}
                className="text-lg text-gray-600 hover:text-red-600 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
