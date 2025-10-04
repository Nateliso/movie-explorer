import { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist, getMovieDetails, updateRating } from '../services/api';

function MovieCard({ movie, watchlist, setWatchlist }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isInWatchlist = watchlist.some((item) => item.movie_id === movie.id);

  useEffect(() => {
    const movieInWatchlist = watchlist.find((item) => item.movie_id === movie.id);
    if (movieInWatchlist && movieInWatchlist.rating) {
      setRating(movieInWatchlist.rating);
      setIsRated(true);
    } else {
      setRating(0);
      setIsRated(false);
    }
  }, [watchlist, movie.id]);

  const handleWatchlistToggle = async () => {
    try {
      if (isInWatchlist) {
        const item = watchlist.find((item) => item.movie_id === movie.id);
        await removeFromWatchlist(item.movie_id);
        setWatchlist(watchlist.filter((item) => item.movie_id !== movie.id));
        setRating(0);
        setIsRated(false);
      } else {
        const newItem = await addToWatchlist(movie);
        setWatchlist([...watchlist, newItem]);
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err.message);
      alert('Error updating watchlist.');
    }
  };

  const handleShowTrailer = async () => {
    try {
      const data = await getMovieDetails(movie.id);
      const trailer = data.videos?.results?.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        console.log('Trailer URL:', `https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        setShowTrailer(true);
        document.body.style.overflow = 'hidden';
      } else {
        console.log('No trailer found');
        alert('No trailer available for this movie.');
      }
    } catch (err) {
      console.error('Failed to fetch trailer:', err.message);
      alert('Error fetching trailer.');
    }
  };

  const handleCloseTrailer = () => {
    console.log('Closing trailer modal');
    setShowTrailer(false);
    setTrailerUrl('');
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    return () => {
      console.log('Cleaning up trailer modal');
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleRating = async (newRating) => {
    try {
      if (!isInWatchlist) {
        alert('Please add the movie to your watchlist before rating.');
        return;
      }
      const updatedItem = await updateRating(movie.id, newRating);
      setWatchlist(
        watchlist.map((item) =>
          item.movie_id === movie.id ? { ...item, rating: updatedItem.rating } : item
        )
      );
      setRating(updatedItem.rating);
      setIsRated(true);
      alert('Rating submitted!');
    } catch (err) {
      console.error('Rating error:', err.message);
      alert('Error submitting rating.');
    }
  };

  return (
    <div className="movie-card">
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={movie.title}
        className="movie-poster"
      />
      <div style={{ padding: '0.5rem' }}>
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.release_date?.split('-')[0] || 'N/A'}</p>
        <div className="movie-overview-container">
          <p className={`movie-overview ${isExpanded ? 'expanded' : ''}`}>
            {movie.overview}
          </p>
          {movie.overview.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="movie-read-more"
              aria-label={isExpanded ? 'Read less' : 'Read more'}
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={handleWatchlistToggle}
            className={`movie-button ${isInWatchlist ? 'movie-button-watchlist-added' : 'movie-button-watchlist'}`}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isInWatchlist ? 'Remove' : 'Add'}
          </button>
          <button
            onClick={handleShowTrailer}
            className="movie-button movie-button-trailer"
            aria-label="View trailer"
          >
            Trailer
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', marginTop: '0.25rem', justifyContent: 'center' }}>
          <p className="movie-rating">Rate:</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`movie-star ${rating >= star ? 'movie-star-active' : 'movie-star-inactive'}`}
              disabled={isRated || !isInWatchlist}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      {showTrailer && (
        <div className="movie-trailer-overlay">
          <div className="movie-trailer-container">
            <button
              onClick={handleCloseTrailer}
              className="movie-trailer-close"
              aria-label="Close trailer"
            >
              ×
            </button>
            <div className="movie-trailer-iframe">
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={trailerUrl}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieCard;