import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../App.css";
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (isLocked && lockoutTime > 0) {
            timer = setInterval(() => {
                setLockoutTime((prev) => prev - 1);
            }, 1000);
        } else if (lockoutTime === 0) {
            setIsLocked(false);
        }

        return () => clearInterval(timer);
    }, [isLocked, lockoutTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { username, password };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signin', userData);
            localStorage.setItem('token', response.data.token); // Store JWT token
            setMessage('Login successful!');
            navigate('/dashboard'); // Navigate to dashboard
        } catch (err) {
            const errorMessage = err.response ? err.response.data.message : 'Login failed';
            setMessage(errorMessage);

            // Check if lockout error is returned
            if (err.response && err.response.data.message.includes('locked')) {
                const match = errorMessage.match(/after (\d+) seconds/);
                if (match) {
                    const remainingSeconds = parseInt(match[1], 10);
                    setLockoutTime(remainingSeconds);
                    setIsLocked(true);
                }
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLocked}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLocked}
                    />
                    <button type="submit" disabled={isLocked}>Log In</button>
                </form>
                {message && <p>{message}</p>}
                {isLocked && <p>Please wait for {lockoutTime} seconds before trying again.</p>}
            </div>
        </div>
    );

};

export default Login;
