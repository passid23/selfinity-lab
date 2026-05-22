import type {Answer, Course, Question} from "../../App.tsx";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import CourseCard from "./CourseCard.tsx";
import './Dashboard.css';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    RadialBarChart, RadialBar
} from "recharts";

interface DashboardProps {
    answers: Answer[]
    questions: Question[]
}

export const Dashboard = ({ answers, questions } : DashboardProps) => {

    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.post("https://selfinity-lab.onrender.com/api/evaluate", { answers })
            .then((response) => {
                setRecommendedCourses(response.data.courses);
            })
            .catch((err) => {
                console.error("Error fetching recommendations:", err);
                setError("Failed to load courses from backend.");
            });
    }, [answers]);

    //  Data Processing for Recharts
    // useMemo to fix API bugs and have great performance
    const analyticsData = useMemo(() => {
        const currentScores: Record<string, number> = { health_fitness: 0, finance: 0, mental_health: 0 };
        const maxPossibleScores: Record<string, number> = { health_fitness: 0, finance: 0, mental_health: 0 };

        // Calculate maximum points possible based on given questions
        questions.forEach(q => {
            if (maxPossibleScores[q.category] !== undefined) {
                const maxPointsForQuestion = Math.max(...q.options.map(o => o.points), 0);
                maxPossibleScores[q.category] += maxPointsForQuestion;
            }
        });

        // Calculate user's current points based on answers
        answers.forEach(ans => {
            const relatedQuestion = questions.find(q => q._id === ans.questionId);
            if (relatedQuestion && currentScores[relatedQuestion.category] !== undefined) {
                currentScores[relatedQuestion.category] += ans.selectedOption.points;
            }
        });


        const labelMap: Record<string, string> = {
            health_fitness: "Fitness",
            finance: "Finanzen",
            mental_health: "Geist"
        };

        // Format data arrays for Recharts
        const chartData = Object.keys(currentScores).map(key => {
            const max = maxPossibleScores[key] || 10; // Fallback to prevent division by zero
            const score = currentScores[key];
            return {
                subject: labelMap[key],
                'Deine Punkte': score,
                'Max. Punkte': max,
                percentage: Math.round((score / max) * 100),
                fullMark: max
            };
        });

        // Calculate Overall Statistics
        const totalEarned = Object.values(currentScores).reduce((a, b) => a + b, 0);
        const totalMax = Object.values(maxPossibleScores).reduce((a, b) => a + b, 0) || 1;
        const totalPercentage = Math.round((totalEarned / totalMax) * 100);

        // Calculate custom Balance Score: 100 - (spread between highest and lowest percentage)
        const percentages = chartData.map(d => d.percentage);
        const maxPct = Math.max(...percentages, 0);
        const minPct = Math.min(...percentages, 0);
        const balanceScore = Math.max(0, 100 - (maxPct - minPct));

        return {
            chartData,
            radialData: [{ name: 'Gesamt', value: totalPercentage, fill: '#72E0FA' }],
            totalPercentage,
            balanceScore
        };
    }, [answers, questions]);

    return (
        <div className="dashboard-container">
            {/* if error occurs display it */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Diagrams section */}
            <section className="analytics-screen">
                <div className="analytics-header">
                    <h1 className="dashboard-title">Dein <span>Performance Profil</span></h1>
                    <p className="dashboard-subtitle">Auswertung deiner aktuellen Lebensbalance</p>
                </div>

                {/* Radar Chart */}
                <div className="charts-grid">
                    <div className="chart-card radar-item">
                        <h3>Stärken-Profil</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={analyticsData.chartData}>
                                    <PolarGrid stroke="#1E2B45" />
                                    <PolarAngleAxis dataKey="subject" stroke="#8BA3CB" tick={{ fontSize: 13, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} stroke="#1E2B45" tick={{ fill: '#4E617E', fontSize: 11 }} />
                                    <Radar
                                        name="Erreicht (%)"
                                        dataKey="percentage"
                                        stroke="#72E0FA"
                                        fill="#72E0FA"
                                        fillOpacity={0.25}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111A2C', borderColor: '#1E2B45', color: '#fff' }}
                                        formatter={(value) => [`${value}%`, "Erfüllung"]}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/*  Bar Chart */}
                    <div className="chart-card">
                        <h3>Punkte-Vergleich</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="subject" stroke="#8BA3CB" tickLine={false} />
                                    <YAxis stroke="#4E617E" tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111A2C', borderColor: '#1E2B45', color: '#fff' }} />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Bar dataKey="Deine Punkte" fill="#72E0FA" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Max. Punkte" fill="#1E2B45" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Radial Chart */}
                    <div className="chart-card radial-card">
                        <h3>Gesamtergebnis</h3>
                        <div className="chart-container radial-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={analyticsData.radialData} startAngle={90} endAngle={-270}>
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar background={{ fill: '#1E2B45' }} dataKey="value" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="radial-center-text">
                                <span className="radial-value">{analyticsData.totalPercentage}%</span>
                                <span className="radial-label">Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Balance Info */}
                    <div className="chart-card balance-card">
                        <h3>Lebens-Balance</h3>
                        <div className="balance-content">
                            <div className="balance-score-display">
                                <span className="score-num">{analyticsData.balanceScore}</span>
                                <span className="score-max">/ 100</span>
                            </div>
                            <p className="balance-status">
                                {analyticsData.balanceScore > 80 ? "Hervorragende Balance!" :
                                    analyticsData.balanceScore > 50 ? "Gute Basis, verfeinere deine Schwachstellen." :
                                        "Achtung: Unausgewogene Verteilung gefährdet deinen Fokus."}
                            </p>
                            <span className="balance-tip">Wer fit ist aber pleite hat Stress. Wer reich ist aber ausgebrannt hat keine Lebensqualität.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Section */}
            <section className="courses-screen">
            <div className="results-header">
                <h2 className="section-title">Dein <span>nächstes Level</span></h2>
                <p className="section-subtitle">Basierend auf deiner Analyse haben wir diese Module für dich freigeschaltet.</p>
            </div>

            <div className="course-grid">
                {recommendedCourses.length === 0 && !error ? (
                    <p className="loading-text">Analysiere Ergebnisse...</p>
                ) : (
                    recommendedCourses.map((course) => (
                        <CourseCard key={course._id} {...course} />
                    ))
                )}
            </div>
            </section>
        </div>
    );
};