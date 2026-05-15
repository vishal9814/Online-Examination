import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.put('/users/profile', { fullName });
            setMessage('Profile updated successfully!');
            setUser({ ...user, fullName });
            localStorage.setItem('user', JSON.stringify({ ...user, fullName }));
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.put('/users/password', { oldPassword, newPassword });
            setMessage('Password updated successfully!');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        }
    };

    return (
        <div>
            <nav className="navbar">
                <Link to="/dashboard" className="navbar-brand">ExamPortal</Link>
                <div className="navbar-nav">
                    <span style={{ fontWeight: 600 }}>Hi, {user?.fullName || user?.username}</span>
                    <button onClick={logout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </nav>

            <div className="glass-container" style={{ maxWidth: '800px' }}>
                <h2>Dashboard</h2>
                <div className="dashboard-grid">
                    <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/exam')}>
                        <h3>Start Exam</h3>
                        <p>Take a new MCQ examination.</p>
                    </div>
                    <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/results')}>
                        <h3>My Results</h3>
                        <p>View your past examination scores.</p>
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <h3>Profile Management</h3>
                    {message && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{message}</div>}
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
                    
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <form onSubmit={handleUpdateProfile} style={{ flex: 1, minWidth: '300px' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Profile</button>
                        </form>

                        <form onSubmit={handleUpdatePassword} style={{ flex: 1, minWidth: '300px' }}>
                            <div className="form-group">
                                <label>Old Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={oldPassword} 
                                    onChange={(e) => setOldPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
