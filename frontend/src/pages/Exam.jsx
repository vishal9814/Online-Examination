import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Exam = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/exams/questions');
                setQuestions(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching questions", err);
            }
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (loading) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, loading]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post('/exams/submit', { answers });
            navigate('/results', { state: { result: res.data } });
        } catch (err) {
            console.error("Error submitting exam", err);
            alert("Failed to submit exam.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading questions...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="exam-header">
                <h2>MCQ Examination</h2>
                <div className="timer">{formatTime(timeLeft)}</div>
            </div>

            {questions.map((q, index) => (
                <div key={q.id} className="question-card">
                    <h4>{index + 1}. {q.text}</h4>
                    <ul className="options-list">
                        {['A', 'B', 'C', 'D'].map(opt => {
                            const optionKey = `option${opt}`;
                            return (
                                <li key={opt} className="option-item">
                                    <label className="option-label">
                                        <input 
                                            type="radio" 
                                            name={`question-${q.id}`}
                                            value={opt}
                                            checked={answers[q.id] === opt}
                                            onChange={() => handleOptionSelect(q.id, opt)}
                                        />
                                        <span>{q[optionKey]}</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}

            <button className="btn btn-success btn-block" style={{ marginTop: '2rem', fontSize: '1.2rem' }} onClick={handleSubmit}>
                Submit Exam
            </button>
        </div>
    );
};

export default Exam;
