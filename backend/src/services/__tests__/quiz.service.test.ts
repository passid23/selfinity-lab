import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as quizService from '../quiz.service.ts';
import { Question } from '../../../models/Question.ts';
import { Course } from '../../../models/Course.ts';

vi.mock('../../../models/Question.ts', () => ({
  Question: {
    find: vi.fn(),
  },
}));

vi.mock('../../../models/Course.ts', () => ({
  Course: {
    find: vi.fn(),
  },
}));

describe('Quiz Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getQuestions', () => {
    it('should return all questions', async () => {
      const mockQuestions = [{ text: 'Q1', category: 'cat1' }, { text: 'Q2', category: 'cat2' }];
      vi.mocked(Question.find).mockResolvedValue(mockQuestions);

      const result = await quizService.getQuestions();
      expect(result).toEqual(mockQuestions);
      expect(Question.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCourses', () => {
    it('should return courses sorted by minPoints', async () => {
      const mockCourses = [{ title: 'C1', minPoints: 10 }, { title: 'C2', minPoints: 5 }];
      vi.mocked(Course.find).mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockCourses),
      } as any);

      const result = await quizService.getCourses();
      expect(result).toEqual(mockCourses);
      expect(Course.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('evaluateQuiz', () => {
    it('should correctly calculate category scores and recommend courses', async () => {
      const mockQuestions = [
        { _id: 'q1', category: 'finance', text: 'Q1' },
        { _id: 'q2', category: 'mental_health', text: 'Q2' },
      ];
      const mockCourses = [
        { category: 'finance', minPoints: 10, maxPoints: 20, title: 'Finance Basic' },
        { category: 'mental_health', minPoints: 10, maxPoints: 20, title: 'Mental Health Basic' },
        { category: 'finance', minPoints: 21, maxPoints: 30, title: 'Finance Advanced' },
      ];

      vi.mocked(Question.find).mockResolvedValue(mockQuestions);
      vi.mocked(Course.find).mockResolvedValue(mockCourses);

      const mockAnswers = [
        { questionId: 'q1', selectedOption: { points: 15 } },
        { questionId: 'q2', selectedOption: { points: 5 } },
      ];

      const result = await quizService.evaluateQuiz(mockAnswers);

      expect(result.scores).toEqual({
        finance: 15,
        mental_health: 5,
      });
      expect(result.courses).toHaveLength(1);
      expect(result.courses[0].title).toBe('Finance Basic');
    });

    it('should handle missing questions or empty answers', async () => {
      vi.mocked(Question.find).mockResolvedValue([]);
      vi.mocked(Course.find).mockResolvedValue([]);

      const result = await quizService.evaluateQuiz([]);

      expect(result.scores).toEqual({});
      expect(result.courses).toEqual([]);
    });
  });
});
