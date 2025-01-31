const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/register', (req, res) => {
    // Placeholder for registration logic
    res.json({ message: 'User registered (placeholder)' });
});

app.post('/login', (req, res) => {
    // Placeholder for login logic
    res.json({ message: 'User logged in (placeholder)' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
