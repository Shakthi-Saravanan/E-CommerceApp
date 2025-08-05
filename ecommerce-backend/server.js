const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, 'users.json');
const LOGIN_LOG_FILE = path.join(__dirname, 'logins.json'); // ✅ NEW

app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const exists = users.find(user => user.username === username || user.email === email);
  if (exists) {
    return res.status(400).json({ message: 'Username or Email already exists' });
  }

  users.push({ username, email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const match = users.find(user => user.username === username && user.password === password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', username });
});

// ✅ NEW: Log login activity
app.post('/log_login', (req, res) => {
  const { username, timestamp } = req.body;

  if (!username || !timestamp) {
    return res.status(400).json({ message: 'Username and timestamp are required' });
  }

  let logs = [];
  if (fs.existsSync(LOGIN_LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOGIN_LOG_FILE, 'utf-8'));
  }

  logs.push({ username, timestamp });
  fs.writeFileSync(LOGIN_LOG_FILE, JSON.stringify(logs, null, 2));
  res.json({ message: 'Login activity recorded' });
});

// ✅ NEW: Fetch login logs
app.get('/login_logs', (req, res) => {
  if (!fs.existsSync(LOGIN_LOG_FILE)) {
    return res.json([]);
  }

  const logs = JSON.parse(fs.readFileSync(LOGIN_LOG_FILE, 'utf-8'));
  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/get_logs', (req, res) => {
  const logFile = path.join(__dirname, 'logins.json');

  if (fs.existsSync(logFile)) {
    const data = fs.readFileSync(logFile, 'utf-8');
    const logs = JSON.parse(data);
    res.json({ logs });
  } else {
    res.json({ logs: [] });
  }
});

app.post('/add_product', (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

  const newProduct = {
    id: Date.now(),
    name,
    price,
    image
  };

  products.push(newProduct);
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Product added successfully', product: newProduct });
});

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

app.get('/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to read products file' });
  }
});

