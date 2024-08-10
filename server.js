const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db')
const port = process.env.PORT;

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));

app.listen(port, () => console.log(`Server started on port ${port}`));