import axios from "axios";

const API_KEY = "732ea35067bb4d17d32e7d94fb6f8f2f";
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query },
  });
  return response.data.results;
};

export const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: { api_key: API_KEY, append_to_response: "videos" },
  });
  return response.data;
};