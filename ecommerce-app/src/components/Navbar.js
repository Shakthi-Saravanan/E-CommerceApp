import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('loggedInUser');
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  return (
    <nav>
  <div>
    <Link to="/">EZ Kart</Link>
  </div>
  <div>
    {!isLoggedIn && <>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </>}
    {isLoggedIn && <>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/cart">Cart</Link>
      <button onClick={handleLogout}>Logout</button>
    </>}
  </div>
</nav>

  );
};

export default Navbar;
