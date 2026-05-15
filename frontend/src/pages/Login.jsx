import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
            {error && <div className="error-msg" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)' }}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
