import express, { type Request, type Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from "mongoose";
// WICHTIG: Mit { Course } importieren, weil es ein named export ist!
import { Course } from './models/Course.ts';
import { Question } from './models/Question.ts';

const app = express();
const PORT = 5001;

// 1. MONGODB CONNECTION
// Ersetze 'selfinity-lab' durch deinen tatsächlichen Datenbanknamen

const MONGO_URI = process.env.MONGO_URI!;
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB verbunden - yalla!'))
    .catch(err => console.error('❌ MongoDB Verbindungsfehler:', err));

app.use(cors());
app.use(express.json());

app.get('/api/questions', async (req: Request, res: Response) => {
  console.log("📢 GET /api/questions wurde aufgerufen!"); // <--- Das hier einfügen
  try {
    const questions = await Question.find();
    console.log("✅ Fragen gefunden:", questions.length); // <--- Und das
    res.json(questions);
  } catch (e) {
    console.error("❌ Fehler in der Route:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Fragen' });
  }
});

// ─── COURSES ROUTE ───────────────────────────────────────────────────────────
app.get('/api/courses', async (req: Request, res: Response) => {
  console.log("📢 GET /api/courses wurde aufgerufen!");
  try {
    const courses = await Course.find().sort({ minPoints: 1 });
    console.log("✅ Kurse gefunden:", courses.length);
    res.json(courses);
  } catch (e) {
    console.error("❌ Fehler in der Kurs-Route:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Kurse' });
  }
});

// ─── EVALUATE ROUTE ──────────────────────────────────────────────────────────


// Standard Route
app.get('/', (req: Request, res: Response) => {
  res.send('express läuft und MongoDB ist bereit');
});


const getDetailedStatus = (score: number): string => {
  if (score <= 5) return "Explorer (Einsteiger)";
  if (score <= 12) return "Builder (Fortgeschritten)";
  if (score <= 19) return "Advanced (Experte)";
  return "Elite (Profi)";
};

app.post('/api/evaluate', async (req: Request, res: Response) => {
  console.log("📢 POST /api/evaluate wurde aufgerufen!");
  try {
    const { answers } = req.body;

    // Dynamische Scores: Wir starten mit einem leeren Objekt
    const scores: Record<string, number> = {};

    if (Array.isArray(answers)) {
      answers.forEach((item: any) => {
        // Falls Kategorie noch nicht existiert, mit 0 initialisieren
        if (!scores[item.category]) {
          scores[item.category] = 0;
        }
        scores[item.category] += item.points;
      });
    }

    const evaluationResults: Record<string, any> = {};

    // Über die Kategorien loopen, die tatsächlich in den Antworten vorkamen
    for (const cat of Object.keys(scores)) {
      const currentScore = scores[cat];

      // Grenze für "Master" bleibt bei 25, alles darunter wird fein abgestuft
      if (currentScore >= 25) {
        evaluationResults[cat] = {
          score: currentScore,
          status: "Legend",
          course: null,
          message: "Du hast dieses Level bereits gemeistert!"
        };
      } else {
        // Sucht den exakt passenden Kurs aus der DB für dieses Punkte-Intervall
        const recommendedCourse = await Course.findOne({
          category: cat,
          minPoints: { $lte: currentScore },
          maxPoints: { $gte: currentScore }
        });

        evaluationResults[cat] = {
          score: currentScore,
          status: getDetailedStatus(currentScore),
          course: recommendedCourse
        };
      }
    }

    res.json(evaluationResults);

  } catch (err) {
    console.error("❌ Fehler bei Evaluate:", err);
    res.status(500).json({ error: "Server Error", details: err });
  }
});

// ─── ROOT ROUTE ──────────────────────────────────────────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.send('express läuft und MongoDB ist bereit');
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});