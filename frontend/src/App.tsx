import { useEffect, useState } from 'react'
import axios from 'axios'
import { LandingPage } from "./components/LandingPage/LandingPage.tsx";
import Quiz from "./components/Quiz/Quiz.tsx";
import {Dashboard} from "./components/Dashboard/Dashboard.tsx";
import logo from './assets/selfinity.png';


export interface Option {
    _id: string;
    text: string;
    points: number;
}

export interface Question {
    _id: string;
    category: string;
    text: string;
    options: Option[];
}

export interface Answer {
    questionId: string;
    selectedOption: Option;
}

export interface Course {
    _id: string;
    title: string;
    category: string;
    minPoints: number;
    maxPoints: number;
    description: string;
    link: string;
}

function App() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [page, setPage] = useState<'landing' | 'quiz' | 'dashboard'>('landing');
    const [quizResults, setQuizResults] = useState<Answer[]>([]);

    const handleQuizComplete = (finalAnswers: Answer[]) => {
        setQuizResults(finalAnswers); // Store the answers
        setPage('dashboard');       // Switch to dashboard
    };

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const response = await axios.get<Question[]>('http://localhost:5001/api/questions');
                setQuestions(response.data);
            } catch (error) {
                console.error("Fehler beim Laden der Fragen!", error);
            }
        };

        // Status check
        axios.get('http://localhost:5001/')
            .then(response => console.log(response.data))
            .catch(() => console.error("Backend nicht erreichbar! ❌"));


        loadQuestions();
    }, []);

    return (
        <div style={{backgroundColor: '#070B14'}}>
            <img src={logo} alt="logo"
                 style={{
                     position: 'absolute',
                     top: '5px',
                     left: '10px',
                     height: '160px',
                     width: 'auto',
                     zIndex: 10
                 }}/>

            {page === 'landing' && (
                <LandingPage onStart={() => setPage('quiz')} />
            )}

            {page === 'quiz' && (
                /* Pass the fetched questions here */
                <Quiz
                    questions={questions}
                    onComplete={handleQuizComplete}
                />
            )}

            {page === 'dashboard' && (
                <Dashboard
                    answers={quizResults}
                    questions={questions}
                />
            )}
        </div>
    )
}

export default App;