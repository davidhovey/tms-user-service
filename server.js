const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// config load
dotenv.config();

// app initialization
const app = express();

//middle ware definition (utilized for all requests)
app.use(cors()); // use cors
app.use(express.json()); // use json
// log incoming reuqest path
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  next(); // pass to next middleware/route
});
//log status of response
app.use((req, res, next) => {
  const start = Date.now();

  // Listen for when the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});



//route mountin
app.use('/auth', authRoutes);

//ping route defininiton
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

// Only start the server if not running in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`tms-user-service running on port ${PORT}`));
}

// Export for testing
module.exports = app;