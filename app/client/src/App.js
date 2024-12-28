import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./components/Signup"; // Use capitalized SignUp
import Login from './components/Login';

function App() {
    return (
        <Router>
            <div className="App">
                <h1>Authentication App</h1>
                <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
