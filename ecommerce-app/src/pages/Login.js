import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
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
      .then(async res => {
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify({ username: res.data.username }));
        alert('Login successful');

        await axios.post('http://localhost:5000/log_login', {
        username: res.data.username,
        timestamp: new Date().toISOString()
      });

        navigate('/checkout'); 
      
        // Redirect to admin if the user is admin
        if (res.data.username === 'admin') {
          navigate('/admin');
        } else {
          navigate('/checkout');
        }

        
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

  const containerStyle = {
    width: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  };
  

  return (
    <>
    <Navbar /> {/* ✅ Show navbar on top */}
    <div className="container" style={containerStyle}>
      <h2>Login</h2>
      <input style={inputStyle}
        placeholder="Username"
        value={credentials.username}
        onChange={e => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input style={inputStyle}
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button style={buttonStyle} onClick={handleLogin}>Login</button>
    </div>
    </>
  );
};

export default Login;
