import { useState, useEffect } from "react";
import { getMovieDetails } from "../services/api";
import TrailerPlayer from "./TrailerPlayer";

function MovieCard({ movie, watchlist, setWatchlist }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(movie.id);
        setDetails(data);
      } catch (err) {
        console.error("Failed to fetch movie details:", err.message);
        setError("Failed to load movie details.");
      }
    };
    fetchDetails();
  }, [movie.id]);

  const addToWatchlist = () => {
    if (!watchlist.some((item) => item.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  if (error) return <div>{error}</div>;
  if (!details) return <div>Loading...</div>;

  const trailer = details.videos?.results?.find((video) => video.type === "Trailer");

  return (
    <div className="movie-card">
      <h3>{details.title}</h3>
      <p>{details.overview}</p> {/* Full summary now */}
      <button onClick={addToWatchlist}>Add to Watchlist</button>
      {trailer && (
        <>
          <button onClick={toggleTrailer}>
            {showTrailer ? "Hide Trailer" : "Show Trailer"}
          </button>
          {showTrailer && <TrailerPlayer videoKey={trailer.key} />}
        </>
      )}
    </div>
  );
}

export default MovieCard;