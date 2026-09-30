 const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weatherRoute = require('./routes/weather');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/weather', weatherRoute);

app.listen(5000, () => console.log('Server running on port 5000'));