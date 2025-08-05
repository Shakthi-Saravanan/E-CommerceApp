const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Basic server-side validation
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

  // Load and parse users
  let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  // Check for duplicate username or email
  const exists = users.find(user => user.username === username || user.email === email);
  if (exists) {
    return res.status(400).json({ message: 'Username or Email already exists' });
  }

  // Save new user
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
