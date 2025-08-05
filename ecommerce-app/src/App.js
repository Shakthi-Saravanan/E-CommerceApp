import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/Dashboard';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Admin from './pages/admin';
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

// ✅ Wrapper to protect the Checkout route
const CheckoutWrapper = () => {
  const isAuthenticated = localStorage.getItem('user') || localStorage.getItem('loggedInUser');

  if (!isAuthenticated) {
    alert('Please login or register first to proceed to checkout.');
    window.location.href = '/login';
    return null;
  }

  return <Checkout />;
};

export default App;