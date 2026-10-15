import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.ts';
import quizRoutes from './routes/quiz.routes.ts';

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', quizRoutes);

app.get('/', (req, res) => {
  res.send('express läuft und MongoDB ist bereit');
});

export default app;
