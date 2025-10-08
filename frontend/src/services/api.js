import axios from 'axios';

const API_URL = "https://movie-explorer-6q65.onrender.com/api"; // Backend URL

axios.defaults.withCredentials = true;

// Debug interceptor
axios.interceptors.request.use(
  (config) => {
    console.log('Axios Request:', config.method, config.url, config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', response.status, response.config.url, response.headers);
    return response;
  },
  (error) => {
    console.error('Axios Error:', error.response?.status, error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);

export const signup = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password }, { withCredentials: true });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await axios.get(`${API_URL}/movies/search`, { params: { query } });
  return response.data;
};

export const getMovieDetails = async (movieId) => {
  if (!movieId) throw new Error('Invalid movie ID');
  const response = await axios.get(`${API_URL}/movies/${movieId}`);
  return response.data;
};

export const getWatchlist = async () => {
  const response = await axios.get(`${API_URL}/watchlist`, { withCredentials: true });
  return response.data;
};

export const addToWatchlist = async (movie) => {
  if (!movie?.id || !movie?.title) throw new Error('Invalid movie data');
  const response = await axios.post(
    `${API_URL}/watchlist`,
    { movie_id: movie.id, title: movie.title },
    { withCredentials: true }
  );
  return response.data;
};

export const removeFromWatchlist = async (movie_id) => {
  if (!movie_id) throw new Error('Invalid movie_id');
  const response = await axios.delete(`${API_URL}/watchlist/${movie_id}`, { withCredentials: true });
  return response.data;
};

export const updateRating = async (movie_id, rating) => {
  if (!movie_id) throw new Error('Invalid movie_id');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
  const response = await axios.put(
    `${API_URL}/watchlist/${movie_id}/rating`,
    { rating },
    { withCredentials: true }
  );
  return response.data;
};