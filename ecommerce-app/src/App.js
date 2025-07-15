import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Dashboard';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import './App.css';
import bgImage from './assets/bag.jpg'; 

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    </div>
  );
}

// ✅ Custom wrapper to control Checkout access
const CheckoutWrapper = () => {
  const isAuthenticated = localStorage.getItem('user');

  if (!isAuthenticated) {
    alert('Please login or register first to proceed to checkout.');
    window.location.href = '/login';
    return null;
  }

  return <Checkout />;
};

export default App;
