import { useEffect, useState } from 'react'
import axios from 'axios'
import { LandingPage } from "./components/LandingPage/LandingPage.tsx";
import Quiz from "./components/Quiz/Quiz.tsx";


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

function App() {
    const [message, setMessage] = useState('Lade Daten vom Backend...')
    const [questions, setQuestions] = useState<Question[]>([]); // New state for questions
    const [page, setPage] = useState<'landing' | 'quiz' | 'dashboard'>('landing');

    // Separate function to fetch questions
    const loadQuestions = async () => {
        try {
            const response = await axios.get<Question[]>('http://localhost:5001/api/questions');
            setQuestions(response.data);
            console.log("Fragen geladen:", response.data);
        } catch (error) {
            console.error("Fehler beim Laden der Fragen!", error);
        }
    };

    useEffect(() => {
        // 1. Move the logic inside
        const loadQuestions = async () => {
            try {
                const response = await axios.get<Question[]>('http://localhost:5001/api/questions');
                setQuestions(response.data);
            } catch (error) {
                console.error("Fehler beim Laden der Fragen!", error);
            }
        };

        // 2. Status check
        axios.get('http://localhost:5001/')
            .then(response => setMessage(response.data))
            .catch(() => setMessage("Backend nicht erreichbar! ❌"));

        // 3. Call it
        loadQuestions();
    }, []); // Empty dependency array means "only on mount"

    return (
        <div>
            {page === 'landing' && (
                <LandingPage onStart={() => setPage('quiz')} />
            )}

            {page === 'quiz' && (
                /* Pass the fetched questions here */
                <Quiz
                    questions={questions}
                    onComplete={() => setPage('dashboard')}
                />
            )}

            {page === 'dashboard' && (
                <div>

                </div>
            )}
        </div>
    )
}

export default App;