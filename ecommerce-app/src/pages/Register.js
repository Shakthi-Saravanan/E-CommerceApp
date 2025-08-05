import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/register', user);
      const message = res.data.message;
      setMsg(message);
      alert(message);
      navigate('/Login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setMsg(errorMsg);
      alert(errorMsg);
    }
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

  const messageStyle = {
    marginTop: '10px',
    color: msg.includes('success') ? 'green' : 'red',
    fontWeight: 'bold'
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <input
          style={inputStyle}
          placeholder="Username"
          required
          onChange={e => setUser({ ...user, username: e.target.value })}
        />
        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          required
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          required
          onChange={e => setUser({ ...user, password: e.target.value })}
        />
        <button style={buttonStyle} onClick={handleRegister}>Register</button>
        <p style={messageStyle}>{msg}</p>
      </div>
    </>
  );
};

export default Register;
