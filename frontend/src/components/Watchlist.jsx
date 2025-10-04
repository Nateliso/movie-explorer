import { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist, updateRating } from '../services/api';

function Watchlist({ watchlist, setWatchlist }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const data = await getWatchlist();
        setWatchlist(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err.message);
        setError('Failed to load watchlist');
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [setWatchlist]);

  const handleRemoveMovie = async (movie_id) => {
    try {
      await removeFromWatchlist(movie_id);
      setWatchlist(watchlist.filter((movie) => movie.movie_id !== movie_id));
      setError(null);
    } catch (err) {
      console.error('Failed to remove:', err.message);
      setError('Failed to remove movie');
    }
  };

  const handleRatingChange = async (movie_id, rating) => {
    try {
      const updatedItem = await updateRating(movie_id, parseInt(rating));
      setWatchlist(
        watchlist.map((movie) =>
          movie.movie_id === movie_id ? { ...movie, rating: updatedItem.rating } : movie
        )
      );
      setError(null);
    } catch (err) {
      console.error('Failed to update rating:', err.message);
      setError('Failed to update rating');
    }
  };

  if (loading) {
    return <div className="watchlist-loading">Loading watchlist...</div>;
  }

  return (
    <div className="watchlist-container">
      <h2 className="watchlist-title">
        Watchlist {watchlist.length > 0 && `(${watchlist.length})`}
      </h2>
      {error && <p className="watchlist-error">{error}</p>}
      {watchlist.length === 0 ? (
        <p className="watchlist-empty">No movies yet!</p>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {watchlist.map((movie) => (
            <li key={movie.movie_id} className="watchlist-item">
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <span className="watchlist-movie-title">{movie.title}</span>
                {movie.rating && (
                  <span className="watchlist-movie-rating">★ {movie.rating}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                <div style={{ display: 'flex', gap: '0.125rem' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleRatingChange(movie.movie_id, num)}
                      className={`watchlist-star ${movie.rating >= num ? 'watchlist-star-active' : 'watchlist-star-inactive'}`}
                      aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleRemoveMovie(movie.movie_id)}
                  className="watchlist-remove"
                  aria-label="Remove from watchlist"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Watchlist;