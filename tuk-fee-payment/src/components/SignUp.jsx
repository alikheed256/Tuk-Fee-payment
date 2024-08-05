import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import tukProfile from '../assets/images/tuk.png';
import "../assets/styles/signup.css";

const SignUp = () => {
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false); 
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(password)) {
            setError('Password must be at least 8 characters long and include a mixture of uppercase, lowercase, numbers, and special characters.');
            setIsPasswordValid(false);
            return false;
        }
        setError(''); 
        setIsPasswordValid(true);
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitAttempted(true); 
        if (!validatePassword(password)) {
            return; 
        }
        
        axios.post('http://localhost:3000/signup', { admissionNumber, email, password })
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <div className="header-section">
                <nav className="header">
                    <img className="tuk-profile" src={tukProfile} alt="TUK profile" />
                    <h3>Fee Payment Portal</h3>
                </nav>
            </div>

            <div className="sign-in-container">
                <div className="sign-in-section">
                    <h4>Sign Up</h4>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="admissionnumber">Admission Number: </label>
                        <input
                            type="text"
                            name="admissionnumber"
                            value={admissionNumber}
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            required
                        /><br />
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        /><br />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                const newPassword = e.target.value;
                                setPassword(newPassword);
                                if (isSubmitAttempted) {
                                    validatePassword(newPassword);
                                }
                            }}
                            required
                        />
                        <button type="submit" disabled={!isPasswordValid}>Sign Up</button>
                        <a href="/login">Already Signed Up?</a>
                        <p>
                            By creating an account you agree to our
                            <a href="/terms"> Terms and conditions</a>.
                        </p>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
