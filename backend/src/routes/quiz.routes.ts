import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller.ts';

const router = Router();

router.get('/questions', quizController.getQuestions);
router.get('/courses', quizController.getCourses);
router.post('/evaluate', quizController.evaluateQuiz);

export default router;
