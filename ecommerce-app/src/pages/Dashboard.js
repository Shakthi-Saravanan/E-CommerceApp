import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Error fetching products:', err);
        alert('Could not fetch products.');
      });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <h2>{user ? `Hello, ${user.username} 👋` : 'Welcome to EZ Kart!'}</h2>
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
