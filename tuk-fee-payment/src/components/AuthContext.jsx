import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (user && user.access_token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => setProfile(res.data))
                .catch((err) => console.log(err));
        }
    }, [user]);

    const loginWithAdmissionNumber = async (admissionNumber, password) => {
        try {
            const response = await axios.post('http://localhost:3000/login', {  admissionNumber, password });
            if (response.data.message === 'Success') {
                setUser(response.data.user);
                return response.data.user;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const loginWithGoogle = async (token) => {
        try {
            const response = await axios.post('http://localhost:3000/google-login', { token });
            if (response.data.success) {
                setUser(response.data.user);
                return response.data.user;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loginWithAdmissionNumber, loginWithGoogle, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
