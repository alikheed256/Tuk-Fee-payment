import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BankDetails = () => {
    const location = useLocation();
    const referenceNumber = location.state?.referenceNumber;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!referenceNumber) return;

        const fetchBankDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/transaction/bank/${referenceNumber}`);
                setData(response.data);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };

        fetchBankDetails();
    }, [referenceNumber]);

    if (!referenceNumber) {
        return <div>No reference number provided.</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data: {error.message}</div>;
    }

    if (!data) {
        return <div>No data found for reference number: {referenceNumber}</div>;
    }

    return (
        <div>
            <h1>Bank Details</h1>
            <p>Reference Number: {data.reference}</p>
            <p>Sender Name: {data.senderName}</p>
            <p>Amount: {data.amount}</p>
            <p>Transaction Date: {data.transactionDate}</p>
            <p>Account Number: {data.accountNumber}</p>
        </div>
    );
};

export default BankDetails;
