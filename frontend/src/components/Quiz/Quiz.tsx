import QuestionCard from "./QuestionCard.tsx";
import type {Answer, Option, Question} from "../../App.tsx";
import { useState } from "react";
import './Quiz.css';


const Quiz = ({ questions, onComplete }: { questions: Question[], onComplete: (finalAnswers: Answer[]) => void }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Answer[]>([]);

    if (!questions || questions.length === 0) {
        return (
            <div className="quiz-container">
                <p>Fragen werden geladen...</p>
            </div>
        );
    }

    const handleNext = (selectedOption: Option) => {
        const newAnswer = {
            questionId: questions[currentIndex]._id,
            selectedOption
        };

        const updatedAnswers = [...answers, newAnswer];

        if (currentIndex < questions.length - 1) {
            setAnswers(updatedAnswers);
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(updatedAnswers);
        }
    }

    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) return <div>Frage nicht gefunden.</div>;

    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="quiz-container">
            <p className="quiz-info">
                Frage {currentIndex + 1} von {questions.length}
            </p>

            <div className="progress-wrapper">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            <QuestionCard
                question={currentQuestion}
                onAnswer={handleNext}
            />
        </div>
    );
};

export default Quiz;