const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// config load
dotenv.config();

// app initialization
const app = express();

//middle ware definition (utilized for all requests)
app.use(cors());
app.use(express.json());

//route definition
app.use('/auth', authRoutes);

//ping route definition
app.get('/ping', (req, res) => {
    res.send('pong');
});

    //error handling
// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`tms-user-service running on port ${PORT}`));