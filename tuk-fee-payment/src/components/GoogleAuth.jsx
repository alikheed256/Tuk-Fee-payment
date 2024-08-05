import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        try {
            
            const token = response.credential;

            const user = await loginWithGoogle(token);
            console.log('Google login successful:', user);

            navigate('/home');
        
            
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={(error) => console.error('Google Login Error:', error)}
            onFailure={(error) => console.error('Google Login Failure:', error)}
        />
    );
};

export default GoogleAuth;
