import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!credentials.username || !credentials.password) {
      alert('Please enter both username and password');
      return;
    }

    axios.post('http://localhost:5000/login', credentials)
      .then(res => {
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify({ username: res.data.username }));
        alert('Login successful');
        navigate('/checkout'); // or wherever you'd like
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert('Invalid username or password');
        } else {
          alert('Login failed. Try again later.');
          console.error('Login error:', err);
        }
      });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={credentials.username}
        onChange={e => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
