import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#222',
      color: '#fff'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          EZ Kart
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
