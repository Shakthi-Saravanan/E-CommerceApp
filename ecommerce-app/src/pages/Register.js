import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/register', user);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUser({ ...user, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setUser({ ...user, password: e.target.value })} />
      <button onClick={handleRegister}>Register</button>
      <p>{msg}</p>
    </div>
  );
};

export default Register;
