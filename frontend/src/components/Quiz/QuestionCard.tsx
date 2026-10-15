import type {Option, Question} from "../../App.tsx";
import './Quiz.css';

const QuestionCard = ({ question, onAnswer, selectedOptionId }: { question: Question, onAnswer: (opt: Option) => void, selectedOptionId?: string }) => {
    return (
        <div className="quiz-card">
            <h3>{question.text}</h3>
            <div className="options-grid">
                {question.options.map((option) => {
                    const isSelected = option._id === selectedOptionId;
                    return (
                        <button
                            key={option._id}
                            className={`option-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => onAnswer(option)}
                        >
                            {option.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionCard