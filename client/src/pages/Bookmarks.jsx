import React, { useEffect, useState } from "react";
import axios from "axios";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/bookmarks/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(res.data);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to load bookmarked recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token]);

  if (loading) return <div className="p-6 text-center">Loading bookmarks...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📌 Your Bookmarked Recipes</h2>
      {bookmarks.length === 0 ? (
        <p className="text-gray-500">You haven't bookmarked anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookmarks.map((recipe) => (
            <div key={recipe.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img
                src={recipe.image || "https://via.placeholder.com/300"}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
