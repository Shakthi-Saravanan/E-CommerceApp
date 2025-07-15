import React from 'react';
import Navbar from '../components/Navbar'; // Adjust path if needed
import products from '../data/products.json';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <>
      <Navbar /> {/* ✅ Show navbar on top */}

      <div className="container" style={{ padding: '20px' }}>
        {user ? (
          <h2>Hello, {user.username} 👋</h2>
        ) : (
          <h2>Welcome to EZ Kart!</h2>
        )}

        <h3>Our Products</h3>
        <div className="product-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {products.map(product => (
            <div
              key={product.id}
              className="product-card"
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                width: '200px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img src={product.image} alt={product.name} width="150" />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <button
                onClick={() => addToCart(product)}
                style={{
                  padding: '8px 12px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
