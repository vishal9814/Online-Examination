import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(formData.username, formData.email, formData.password, formData.fullName);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
            {error && <div className="error-msg" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        name="fullName"
                        className="form-control" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required 
                        placeholder="John Doe"
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        name="username"
                        className="form-control" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        placeholder="johndoe123"
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email"
                        className="form-control" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        placeholder="john@example.com"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password"
                        className="form-control" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        placeholder="Min 6 characters"
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
            </p>
        </div>
    );
};

export default Signup;
