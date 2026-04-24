import express, { type Request, type Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from "mongoose";

// Importiere die Modelle aus den separaten Dateien
import { Question } from './models/Question.ts';
import { Course } from './models/Course.ts';

const app = express();
const PORT = 5001;

const MONGO_URI = process.env.MONGO_URI!;
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB verbunden - yalla!'))
    .catch(err => console.error('❌ MongoDB Verbindungsfehler:', err));

app.use(cors());
app.use(express.json());

// ─── QUESTIONS ROUTE ─────────────────────────────────────────────────────────
app.get('/api/questions', async (req: Request, res: Response) => {
  console.log("📢 GET /api/questions wurde aufgerufen!");
  try {
    const questions = await Question.find();
    console.log("✅ Fragen gefunden:", questions.length);
    res.json(questions);
  } catch (e) {
    console.error("❌ Fehler in der Route:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Fragen' });
  }
});

// ─── COURSES ROUTE (Gleich wie Questions) ────────────────────────────────────
app.get('/api/courses', async (req: Request, res: Response) => {
  console.log("📢 GET /api/courses wurde aufgerufen!");
  try {
    const courses = await Course.find();
    console.log("✅ Kurse gefunden:", courses.length);
    res.json(courses);
  } catch (e) {
    console.error("❌ Fehler in der Kurs-Route:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Kurse' });
  }
});

// ─── ROOT ROUTE ──────────────────────────────────────────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.send('express läuft und MongoDB ist bereit');
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});