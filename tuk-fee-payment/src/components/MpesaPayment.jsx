import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/styles/mpesapayment.css';
import axios from 'axios';

function MpesaPayment() {
    const [amount, setAmount] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const location = useLocation();
    const service = location.state?.service || "No service provided";

    const handleAmount = (e) => {
        setAmount(e.target.value);
    };

    const handleNumber = (e) => {
        setPhoneNumber(e.target.value.trim());
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!phone || !amount) {
            alert('Please fill in both fields');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(' https://3a55-196-201-225-126.ngrok-free.app/api/stkPush', { phone, amount });
            console.log('Response Data:', response.data); 
            setSuccess('Payment initiated successfully. Please check your phone.');
        } catch (err) {
            console.error('Error:', err); // Debugging error
            setError('An error occurred while initiating payment.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [success]);

    useEffect(() => {
        let timer;
        if (error) {
            timer = setTimeout(() => {
                setError(null);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <div className="mpesa-container">
            <h2>Make Payment Here</h2>
            <label className="service-class">Service: {service}</label>
            <form onSubmit={handlePayment}>
                <label className="amount-class">Amount:</label>
                <input
                    className="amount-input"
                    type="number"
                    value={amount}
                    onChange={handleAmount}
                    required
                /><br />
                <label className="number-class">Mpesa Number:</label>
                <input
                    className="phone-input"
                    type="text"
                    value={phone}
                    onChange={handleNumber}
                    required
                /><br />
                <button className="mpesa-button" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Make Payment'}
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
        </div>
    );
}

export default MpesaPayment;
