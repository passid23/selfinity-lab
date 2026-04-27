import type {Option, Question} from "../../App.tsx";
import '../Quiz/Quiz.css';

const QuestionCard = ({ question, onAnswer }: { question: Question, onAnswer: (opt: Option) => void }) => {
    return (
        <div className="quiz-card">
            <h3>{question.text}</h3>
            <div className="options-grid">
                {question.options.map((option) => (
                    <button
                        key={option._id}
                        className="option-button"
                        onClick={() => onAnswer(option)}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard