function Watchlist({ watchlist, setWatchlist }) {
  const removeMovie = (id) => {
    setWatchlist(watchlist.filter((movie) => movie.id !== id));
  };

  return (
    <div className={`watchlist ${watchlist.length === 0 ? "empty" : ""}`}>
      <h2>Watchlist {watchlist.length > 0 && `(${watchlist.length})`}</h2>
      {watchlist.length === 0 ? (
        <p>No movies yet!</p>
      ) : (
        watchlist.map((movie) => (
          <div key={movie.id}>
            <span>{movie.title}</span>
            <button onClick={() => removeMovie(movie.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Watchlist;