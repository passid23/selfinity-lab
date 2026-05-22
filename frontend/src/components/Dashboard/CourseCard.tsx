import type { Course } from "../../App";
import './Dashboard.css';

const CourseCard = ({ title, category, description, link }: Course) => {

    // change internal categories to display names
    const formatCategory = (cat: string) => {
        const categories: Record<string, string> = {
            finance: "Finanzen",
            mental_health: "Geist",
            health_fitness: "Fitness"
        };
        return categories[cat] || cat;
    };

    return (
        <div className="course-card">
            <div className="course-meta">
                <span className="course-category">{formatCategory(category)}</span>
            </div>
            <h3 className="course-title">{title}</h3>
            <p className="course-description">{description}</p>
            <a href={link} className="course-btn" target="_blank" rel="noopener noreferrer">
                Zum Kurs
            </a>
        </div>
    );
};

export default CourseCard;