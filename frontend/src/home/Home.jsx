import React, { useEffect, useState } from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
      <p className="text-sm text-gray-400 mb-1">Rating: {movie.rating}</p>
      <p className="text-sm text-gray-400 mb-1">Genre: {movie.listed_in}</p>
      <p className="text-sm">{movie.description}</p>
    </div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Ensure the URL corresponds to your backend correctly
        const response = await fetch("http://localhost:8000/movies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Check for successful response
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response from your API
        const data = await response.json();
        console.log("Fetched movies:", data);
        setMovies(data);  // Store movies data in state
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err.message);  // Handle any error that occurs during fetch
      } finally {
        setLoading(false);  // Loading is complete, no matter the outcome
      }
    };

    fetchMovies();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Movie List</h1>

      {loading && <p className="text-gray-400">Loading movies...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p className="text-gray-400">No movies found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
