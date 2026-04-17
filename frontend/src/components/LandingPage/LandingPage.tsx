import './LandingPage.css'

function LandingPage() {
    return (
        <div className="landing-container">
            {/* 1. HERO SECTION */}
            <header className="hero-section">
                <h1>Wie fit bist du wirklich?</h1>
                <p className="subline">
                    In nur 2 Minuten analysieren wir deine Performance in den drei wichtigsten Lebensbereichen:
                    <strong> Fitness, Finanzen & Geist.</strong> Finde heraus, wo du stehst und wo dein größtes Potenzial schlummert.
                </p>
                <a href="#quiz" className="cta-button">Jetzt Gratis-Checkup starten</a>
            </header>

            {/* 2. DIE 3 SÄULEN */}
            <section className="pillars-section">
                <h2>Die 3 Säulen deines Erfolgs</h2>
                <div className="pillars-grid">
                    <article className="pillar-card">
                        <h3>Fitness</h3>
                        <p>Körperliche Vitalität, Energielevel und Gewohnheiten. Bist du eine Maschine oder eher ein Faultier?</p>
                    </article>

                    <article className="pillar-card">
                        <h3>Finanzen</h3>
                        <p>Sicherheit, Wachstum und Strategie. Arbeitest du für dein Geld oder arbeitet dein Geld für dich?</p>
                    </article>

                    <article className="pillar-card">
                        <h3>Geist</h3>
                        <p>Mentale Stärke, Fokus und innere Ruhe. Beherrschst du deine Gedanken oder beherrschen sie dich?</p>
                    </article>
                </div>
                {/* Zwischen-Link zum Quiz */}
                <div className="mid-cta">
                    <a href="#quiz">Direkt zum Test</a>
                </div>
            </section>

            {/* 3. PAIN POINT & LÖSUNG */}
            <section className="problem-solution">
                <h2>Warum Balance alles ist</h2>
                <p>
                    Die meisten Menschen sind in einem Bereich stark, vernachlässigen aber die anderen.
                    Wer fit ist, aber pleite, hat Stress. Wer reich ist, aber ausgebrannt, hat keine Lebensqualität.
                </p>
                <p className="highlight-text">
                    <strong>Finde deine Schwachstelle, bevor sie zum Problem wird.</strong>
                </p>
            </section>

            {/* 4. NUTZEN (BENEFITS) */}
            <section className="benefits">
                <h2>Was du nach dem Quiz erhältst:</h2>
                <ul>
                    <li>
                        <strong>Persönliche Status-Quo-Analyse:</strong>
                        Ein detaillierter Score für jeden deiner Lebensbereiche.
                    </li>
                    <li>
                        <strong>Individuelle Handlungsempfehlungen:</strong>
                        Konkrete Schritte, um dein nächstes Level zu erreichen.
                    </li>
                    <li>
                        <strong>Benchmark-Vergleich:</strong>
                        Sieh, wie du im Vergleich zum Durchschnitt abschneidest.
                    </li>
                </ul>
            </section>

            {/* 5. SOCIAL PROOF */}
            <section className="social-proof">
                <div className="stats">
                    <span className="stat-number">500+</span>
                    <span className="stat-text">Durchgeführte Analysen</span>
                </div>
                <blockquote className="testimonial">
                    <p>"Ich dachte, ich wäre finanziell gut aufgestellt, bis der Test mir die Augen für meine Rentenlücke geöffnet hat."</p>
                    <cite>— Simon B.</cite>
                </blockquote>
            </section>

            {/* 6. FINALER CTA */}
            <footer className="footer-cta">
                <h2>Bereit für die Wahrheit?</h2>
                <p>Keine Anmeldung nötig. 15 Fragen. 100% Klarheit.</p>
                <a href="#quiz" className="cta-button-large">Quiz jetzt starten</a>
            </footer>
        </div>
    )
}

export default LandingPage