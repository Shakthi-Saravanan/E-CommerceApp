import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Welcome to ShopZen</h2>
    <p>Please register or login to start shopping!</p>
    <Link to="/register"><button>Register</button></Link>
    <Link to="/login"><button>Login</button></Link>
  </div>
);

export default Home;
