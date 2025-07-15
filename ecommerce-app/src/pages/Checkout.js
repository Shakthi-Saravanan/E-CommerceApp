import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    if (items.length === 0) {
      alert("Cart is empty. Please add items before checking out.");
      navigate('/');
    }
    setCartItems(items);
  }, [navigate]);

  const totalCost = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: 'auto' }}>
      <h2>Checkout - Invoice</h2>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f8f8'
        }}
      >
        <h3 style={{ textAlign: 'center' }}>Invoice Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Item</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px 0' }}>{item.name}</td>
                <td style={{ textAlign: 'right' }}>₹{item.price}</td>
              </tr>
            ))}
            <tr>
              <td style={{ paddingTop: '10px', fontWeight: 'bold' }}>Total</td>
              <td style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                ₹{totalCost}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={handlePlaceOrder}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            float: 'right'
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
