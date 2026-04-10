import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from "mongoose";
// WICHTIG: Mit { Course } importieren, weil es ein named export ist!
import { Course } from './models/Course.ts';

const app = express();
const PORT = 5000;

// 1. MONGODB CONNECTION
// Ersetze 'selfinity-lab' durch deinen tatsächlichen Datenbanknamen
const MONGO_URI = 'mongodb://127.0.0.1:27017/selfinity-lab';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB verbunden - yalla!'))
    .catch(err => console.error('❌ MongoDB Verbindungsfehler:', err));

app.use(cors());
app.use(express.json());

// Standard Route
app.get('/', (req: Request, res: Response) => {
  res.send('express läuft und MongoDB ist bereit');
});

// 2. DIE SORTIERLOGIK (EVALUATE)
app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;

    // Eimer vorbereiten (mit Typisierung für TS)
    const scores: Record<string, number> = {
      finance: 0,
      mental_health: 0,
      health_fitness: 0
    };

    // Durch alle Antworten loopen
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
          status: currentScore < 10 ? "Anfänger" : "Fortgeschritten",
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