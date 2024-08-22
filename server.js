import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import tallyRoutes from './routes/tallyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const port = process.env.PORT;

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tally', tallyRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));