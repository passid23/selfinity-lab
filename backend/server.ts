import express, { type Request, type Response } from 'express';
import cors from 'cors';
import Course from './models/Course';
import mongoose from "mongoose";

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('express läuft');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { answers } = req.body; // Kommt vom Frontend

    // 1. Die "Eimer" vorbereiten
    const scores = {
      finance: 0,
      mental_health: 0,
      health_fitness: 0
    };

    // 2. Durch alle Antworten loopen und Punkte im richtigen Eimer addieren
    answers.forEach(item => {
      if (scores.hasOwnProperty(item.category)) {
        scores[item.category] += item.points;
      }
    });

    // 3. Für jeden Eimer den passenden Kurs aus der DB holen
    const evaluationResults = {};

    for (const cat of Object.keys(scores)) {
      const currentScore = scores[cat];

      if (currentScore >= 25) {
        evaluationResults[cat] = { score: currentScore, status: "Master", course: null };
      } else {
        // MongoDB Query: Finde Kurs, wo Score zwischen min und max liegt
        const recommendedCourse = await Course.findOne({
          category: cat,
          minPoints: { $lte: currentScore },
          maxPoints: { $gte: currentScore }
        });

        evaluationResults[cat] = {
          score: currentScore,
          status: "Learner",
          course: recommendedCourse
        };
      }
    }

    res.json(evaluationResults);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});