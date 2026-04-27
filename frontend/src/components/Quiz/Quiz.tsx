import QuestionCard from "../QuestionCard/QuestionCard.tsx";
import type { Option, Question } from "../../App.tsx";
import { useState } from "react";
import './Quiz.css';

// 1. Define the shape of a single answer
interface Answer {
    questionId: string;
    selectedOption: Option;
}

const Quiz = ({ questions, onComplete }: { questions: Question[], onComplete: () => void }) => {
    // Fixed: Removed the empty <> and ensured it's typed as a number
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // Fixed: Defined the state as an array of Answers to avoid the 'never' error
    const [answers, setAnswers] = useState<Answer[]>([]);

    // IMPORTANT: If questions haven't arrived yet, show a loading state
    // This prevents the "Cannot read properties of undefined (reading '0')" error
    if (!questions || questions.length === 0) {
        return (
            <div className="quiz-container">
                <p>Fragen werden geladen...</p>
            </div>
        );
    }

    const handleNext = (selectedOption: Option) => {
        setAnswers(prevAnswers => [
            ...prevAnswers,
            { questionId: questions[currentIndex]._id, selectedOption }
        ]);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const currentQuestion = questions[currentIndex];

    // 2. SECONDARY GUARD: In case index gets out of sync
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