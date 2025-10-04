import { useState } from 'react';
import { searchMovies } from '../services/api';

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err.message);
      setError('Something went wrong searching movies. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="search-input"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="search-button"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="search-error">{error}</p>}
    </form>
  );
}

export default SearchBar;