import { useState } from "react";
import { searchMovies } from "../services/api";

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState("");
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
      console.error("Search failed:", err.message); // Log for debugging
      setError("Something went wrong searching movies. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for a movie..."
      />
      <button type="submit" disabled={isLoading}>
      {isLoading ? "Searching..." : "Search"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default SearchBar;