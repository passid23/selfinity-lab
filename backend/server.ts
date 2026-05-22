import express, { type Request, type Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from "mongoose";
// WICHTIG: Mit { Course } importieren, weil es ein named export ist!
import {Course, type ICourse} from './models/Course.ts';
import {type IQuestion, type IOption,Question} from './models/Question.ts';

const app = express();
const PORT = process.env.PORT || 5001;

interface IAnswer {
  questionId: string;
  selectedOption: IOption;
}

// 1. MONGODB CONNECTION
// Ersetze 'selfinity-lab' durch deinen tatsächlichen Datenbanknamen

const MONGO_URI = process.env.MONGO_URI!;
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB verbunden - yalla!'))
    .catch(err => console.error('MongoDB Verbindungsfehler:', err));

app.use(cors());
app.use(express.json());

app.get('/api/questions', async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    console.log("Fragen gefunden:", questions.length);

    res.json(questions);
  } catch (e) {
    console.error("Fehler in der Route:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Fragen' });
  }
});

app.get('/api/courses', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().sort({ minPoints: 1 });
    console.log("Kurse gefunden:", courses.length);

    res.json(courses);

  } catch (e) {
    console.error("Fehler in der Kurs-Route:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Kurse' });
  }
});

// Standard Route
app.get('/', (req: Request, res: Response) => {
  res.send('express läuft und MongoDB ist bereit');
});


app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const { answers } = req.body as {answers: IAnswer[]};
    const allQuestions: IQuestion[] = await Question.find();
    const allCourses: ICourse[] = await Course.find();

    // Object to hold scores: e.g., { "finance": 10, "mental_health": 5 }
    const categoryScores: Record<string, number> = {};

    answers.forEach((ans: IAnswer) => {
      const question = allQuestions.find(q => q._id.toString() === ans.questionId);

      if (question) {
        const cat = question.category;
        const points = ans.selectedOption.points;

        if (!categoryScores[cat]) {
          categoryScores[cat] = 0;
        }
        categoryScores[cat] += points;
      }
    });

    // Filter courses based on the points calculated
    const recommendations = allCourses.filter(course => {
      const userScore = categoryScores[course.category] || 0;
      return userScore >= course.minPoints && userScore <= course.maxPoints;
    });

    res.json({
      scores: categoryScores,
      courses: recommendations
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ message: "Failed to process recommendations" });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('express läuft');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});