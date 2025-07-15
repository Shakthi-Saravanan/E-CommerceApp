import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemsWithQuantity = items.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setCartItems(itemsWithQuantity);
  }, []);

  const updateCartStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    updateCartStorage(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setShowInvoice(false);
    setShowAuthPrompt(false);
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updateCartStorage(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCartStorage(updatedCart);
    } else {
      removeFromCart(index);
    }
  };

  const totalCost = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <h4>
                {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => decreaseQuantity(index)} style={btnStyle}>−</button>
                <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => increaseQuantity(index)} style={btnStyle}>+</button>
              </div>

              <button onClick={() => removeFromCart(index)} style={{ marginTop: '5px' }}>
                Remove
              </button>
            </div>
          ))}

          <hr />
          <h3>Total Cost: ₹{totalCost}</h3>

          <button onClick={clearCart} style={{ marginTop: '10px', backgroundColor: '#f97316', color: 'white', padding: '6px 12px' }}>
            Clear All
          </button>

          <button onClick={() => setShowInvoice(true)} style={{ marginTop: '10px', marginLeft: '10px', backgroundColor: '#2563eb', color: 'white', padding: '6px 12px' }}>
            Generate Invoice
          </button>

          <button
            onClick={() => {
              const user = localStorage.getItem('user');
              if (user) {
                navigate('/checkout');
              } else {
                setShowAuthPrompt(true);
              }
            }}
            style={{ marginTop: '10px', marginLeft: '10px', backgroundColor: '#16a34a', color: 'white', padding: '6px 12px' }}
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {showAuthPrompt && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
          <p style={{ marginBottom: '10px' }}>You must be logged in to proceed. Please choose an option:</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={authBtnStyle('#3b82f6')}>Login</Link>
            <Link to="/register" style={authBtnStyle('#f97316')}>Register</Link>
          </div>
        </div>
      )}

      {showInvoice && cartItems.length > 0 && (
        <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f8f8', color: 'black' }}>
          <h3 style={{ textAlign: 'center' }}>Invoice</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Item</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'center' }}>Qty</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '6px 0' }}>{item.name}</td>
                  <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
              <tr>
                <td style={{ paddingTop: '10px', fontWeight: 'bold' }}>Total</td>
                <td />
                <td style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>₹{totalCost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const btnStyle = {
  width: '20px',
  height: '20px',
  fontSize: '12px',
  padding: '0',
  lineHeight: '1',
  border: '1px solid #999',
  borderRadius: '3px',
  backgroundColor: 'white',
  cursor: 'pointer',
  color: 'black'
};

const authBtnStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  padding: '8px 16px',
  borderRadius: '4px',
  textDecoration: 'none'
});

export default Cart;
