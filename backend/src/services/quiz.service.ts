import { Course, type ICourse } from '../../models/Course.ts';
import { Question, type IQuestion, type IOption } from '../../models/Question.ts';

interface IAnswer {
  questionId: string;
  selectedOption: IOption;
}

export const getQuestions = async () => {
  return await Question.find();
};

export const getCourses = async () => {
  return await Course.find().sort({ minPoints: 1 });
};

export const evaluateQuiz = async (answers: IAnswer[]) => {
  const allQuestions: IQuestion[] = await Question.find();
  const allCourses: ICourse[] = await Course.find();

  const categoryScores: Record<string, number> = {};

  answers.forEach((ans) => {
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

  const recommendations = allCourses.filter(course => {
    const userScore = categoryScores[course.category] || 0;
    return userScore >= course.minPoints && userScore <= course.maxPoints;
  });

  return {
    scores: categoryScores,
    courses: recommendations
  };
};
