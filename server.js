const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const app = express();

// Connect DB
connectDB();

// Init middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API running...'));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));