import type {Request, Response} from 'express';
import * as quizService from '../services/quiz.service.ts';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await quizService.getQuestions();
    res.json(questions);
  } catch (e) {
    console.error("Error in getQuestions controller:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Fragen' });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await quizService.getCourses();
    res.json(courses);
  } catch (e) {
    console.error("Error in getCourses controller:", e);
    res.status(500).json({ error: 'Fehler beim Laden der Kurse' });
  }
};

export const evaluateQuiz = async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;
    const result = await quizService.evaluateQuiz(answers);
    res.json(result);
  } catch (error) {
    console.error("Recommendation Error in controller:", error);
    res.status(500).json({ message: "Failed to process recommendations" });
  }
};
