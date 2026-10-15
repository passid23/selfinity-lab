import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.ts';
import * as quizService from '../services/quiz.service.ts';

vi.mock('../services/quiz.service.ts');

describe('Quiz API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/questions', () => {
    it('should return questions', async () => {
      const mockQuestions = [{ text: 'Q1' }, { text: 'Q2' }];
      vi.mocked(quizService.getQuestions).mockResolvedValue(mockQuestions);

      const response = await request(app).get('/api/questions');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);
    });
  });

  describe('GET /api/courses', () => {
    it('should return courses', async () => {
      const mockCourses = [{ title: 'C1' }, { title: 'C2' }];
      vi.mocked(quizService.getCourses).mockResolvedValue(mockCourses);

      const response = await request(app).get('/api/courses');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
    });
  });

  describe('POST /api/evaluate', () => {
    it('should return evaluation results', async () => {
      const mockResult = {
        scores: { finance: 10 },
        courses: [{ title: 'Course 1' }]
      };
      vi.mocked(quizService.evaluateQuiz).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/evaluate')
        .send({ answers: [{ questionId: '1', selectedOption: { points: 10 } }] });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });
  });
});
