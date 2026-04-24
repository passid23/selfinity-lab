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


app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;

    // Eimer vorbereiten (mit Typisierung für TS)
    const scores: Record<string, number> = {
      finance: 0,
      mental_health: 0,
      health_fitness: 0
    };

    if (Array.isArray(answers)) {
      answers.forEach((item: any) => {
        if (Object.prototype.hasOwnProperty.call(scores, item.category)) {
          scores[item.category] += item.points;
        }
      });
    }

    const evaluationResults: Record<string, any> = {};

    // Über die Kategorien loopen und Kurse suchen
    for (const cat of Object.keys(scores)) {
      const currentScore = scores[cat];

      if (currentScore >= 25) {
        evaluationResults[cat] = {
          score: currentScore,
          status: "Master",
          course: null,
          message: "Du bist bereits ein Profi!"
        };
      } else {
        // Findet den Kurs, der zum Score passt
        const recommendedCourse = await Course.findOne({
          category: cat,
          minPoints: { $lte: currentScore },
          maxPoints: { $gte: currentScore }
        });

        evaluationResults[cat] = {
          score: currentScore,
          status: currentScore < 10 ? "Anfängjer" : "Fortgeschritten",
          course: recommendedCourse
        };
      }
    }

    res.json(evaluationResults);

  } catch (err) {
    console.error("Fehler bei Evaluate:", err);
    res.status(500).json({ error: "Server Error", details: err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});