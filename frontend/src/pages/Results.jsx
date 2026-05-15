import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useLocation } from 'react-router-dom';

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    // Check if we just submitted an exam
    const recentResult = location.state?.result;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get('/exams/results');
                // Sort by date descending
                const sorted = res.data.sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken));
                setResults(sorted);
            } catch (err) {
                console.error("Error fetching results", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading results...</div>;

    return (
        <div>
            <nav className="navbar">
                <Link to="/dashboard" className="navbar-brand">ExamPortal</Link>
                <div className="navbar-nav">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </div>
            </nav>

            <div className="glass-container" style={{ maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '2rem' }}>Examination Results</h2>

                {recentResult && (
                    <div style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
                        <h3>Recent Submission</h3>
                        <p style={{ color: 'white' }}>You scored {recentResult.score} out of {recentResult.totalQuestions}!</p>
                    </div>
                )}

                {results.length === 0 ? (
                    <p>You haven't taken any exams yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {results.map((r, index) => (
                            <div key={r.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Exam #{results.length - index}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        {new Date(r.dateTaken).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                    {r.score} / {r.totalQuestions}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
