import { useEffect, useState } from "react";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.slice(0, 5))) // Get only the first 5 movies
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Top 5 Movies</h2>
      <ul className="space-y-2">
        {movies.map((movie, index) => (
          <li key={index} className="p-2 border rounded shadow">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p className="text-sm text-gray-600">
              {movie.director || "Unknown Director"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;

// import { useEffect, useState } from "react";

// const MovieList = () => {
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:8000/movies")
//       .then((response) => response.json())
//       .then((data) => {
//         setMovies(data.slice(0, 5)); // Get only the first 5 movies
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching movies:", error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-4 max-w-lg mx-auto">
//         <h2 className="text-2xl font-bold mb-4">Top 5 Movies</h2>
//         <p>Loading movies...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Top 5 Movies</h2>
//       <div className="space-y-6">
//         {movies.map((movie) => (
//           <div key={movie.id} className="flex gap-4 p-4 border rounded-lg shadow-md bg-white">
//             {/* Movie Poster */}
//             <div className="flex-shrink-0 w-32 h-48 overflow-hidden rounded">
//               {movie.poster_url ? (
//                 <img
//                   src={movie.poster_url}
//                   alt={`Poster for ${movie.title}`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "https://via.placeholder.com/150x225?text=No+Poster";
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500 text-sm">No poster available</span>
//                 </div>
//               )}
//             </div>

//             {/* Movie Details */}
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold">{movie.title}</h3>
//               <p className="text-sm text-gray-600 mb-1">
//                 {movie.director || "Unknown Director"}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 {movie.release_year} • {movie.rating}
//               </p>
//               <p className="text-sm text-gray-500 line-clamp-3">
//                 {movie.description}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MovieList;
