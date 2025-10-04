import { useState } from 'react';
import { signup, login } from '../services/api';

function Auth({ setUser, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = isLogin ? await login(username, password) : await signup(username, password);
      if (isLogin) {
        setUser(response.user);
        onLogin();
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="text-center mb-6">
          <h1 className="auth-title">Welcome to Movie Explorer!</h1>
          <p className="auth-subtitle">
            Discover your favorite movies, watch trailers, and build your personal watchlist.
          </p>
          <p className="auth-subtext">
            {isLogin ? 'Sign in to access your watchlist' : 'Create an account to get started'}
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="auth-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="auth-input"
            />
          </div>
          <div>
            <label className="auth-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="auth-input"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="auth-subtext">
            {isLogin ? 'Don’t have an account?' : 'Already have an account?'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="auth-toggle"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;