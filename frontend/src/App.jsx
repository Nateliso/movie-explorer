import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar.jsx';
import MovieCard from './components/MovieCard.jsx';
import Watchlist from './components/Watchlist.jsx';
import Auth from './components/Auth.jsx';
import { GiPopcorn } from "react-icons/gi";
import { getWatchlist, logout, getCurrentUser } from './services/api';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const checkUser = async () => {
    try {
      console.log('Checking user...');
      const response = await getCurrentUser();
      console.log('getCurrentUser response:', response);
      if (response.user) {
        setUser(response.user);
        const watchlistData = await getWatchlist();
        setWatchlist(watchlistData);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to check user:', err.message);
      }
    } finally {
      setIsCheckingUser(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setWatchlist([]);
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  if (isCheckingUser) {
    return (
      <div className="app-loading">
        <p className="app-loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {!user ? (
        <div className="bg-login-hero">
          <Auth setUser={setUser} onLogin={checkUser} />
        </div>
      ) : (
        <div className="app-content">
          <div className="app-header">
            <h1 className="app-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <GiPopcorn />Movie Explorer</h1>
            <button onClick={handleLogout} className="app-logout">
              Logout
            </button>
          </div>
          <SearchBar setSearchResults={setSearchResults} />
          <div className="app-main">
            <div style={{ flex: 1 }}>
              {searchResults.length === 0 ? (
                <p className="app-empty">Search for movies!</p>
              ) : (
                <div className="app-grid">
                  {searchResults.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      watchlist={watchlist}
                      setWatchlist={setWatchlist}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="watchlist-container">
              <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;