import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Admin = () => {
  const [logs, setLogs] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/get_logs')
      .then(response => {
        setLogs(response.data.logs || []);
      })
      .catch(error => {
        console.error("Error fetching logs:", error);
      });
  }, []);

  const handleProductAdd = () => {
    const { name, price, image } = product;
    if (!name || !price || !image) {
      alert('Fill all product fields');
      return;
    }

    axios.post('http://localhost:5000/add_product', product)
      .then(res => {
        alert('✅ Product added');
        setProduct({ name: '', price: '', image: '' });
      })
      .catch(err => {
        console.error('Error:', err);
        alert('❌ Failed to add product');
      });
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h2>User Login Activities</h2>
        {logs.length === 0 ? (
          <p>No login activity recorded.</p>
        ) : (
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{log.username}</td>
                  <td style={tdStyle}>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr style={{ margin: '40px 0' }} />

        <h2>Add Product (Admin Only)</h2>
        <input
          placeholder="Product Name"
          value={product.name}
          onChange={e => setProduct({ ...product, name: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Price"
          value={product.price}
          onChange={e => setProduct({ ...product, price: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Image Path (e.g., /images/ps5.jpg)"
          value={product.image}
          onChange={e => setProduct({ ...product, image: e.target.value })}
          style={inputStyle}
        />
        <button onClick={handleProductAdd} style={buttonStyle}>➕ Add Product</button>
      </div>
    </>
  );
};

// Inline Styles
const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  background: '#f0f0f0',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px'
};

const inputStyle = {
  display: 'block',
  marginBottom: '10px',
  padding: '8px',
  width: '300px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const buttonStyle = {
  padding: '10px 20px',
  background: '#10b981',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Admin;
