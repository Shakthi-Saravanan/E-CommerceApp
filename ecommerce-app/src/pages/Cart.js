import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  // ✅ Calculate total cost
  const totalCost = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index}>
              <h4>{item.name} - ₹{item.price}</h4>
            </div>
          ))}
          <hr />
          <h3>Total Cost: ₹{totalCost}</h3>
        </>
      )}
    </div>
  );
};

export default Cart;
