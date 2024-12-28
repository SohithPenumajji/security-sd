import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { username, password };
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );

};

export default SignUp;
