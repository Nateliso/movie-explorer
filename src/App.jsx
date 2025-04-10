import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import Watchlist from "./components/Watchlist";
import "./index.css";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem("watchlist")) || []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <div className="app">
      <h1>Movie Explorer</h1>
      <SearchBar setSearchResults={setSearchResults} />
      <div className="layout">
        <div className="search-results">
          {searchResults.map((movie) => (
            <MovieCard key={movie.id} movie={movie} watchlist={watchlist} setWatchlist={setWatchlist} />
          ))}
        </div>
        <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
      </div>
    </div>
  );
}

export default App;