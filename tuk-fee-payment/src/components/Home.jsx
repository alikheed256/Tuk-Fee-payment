import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tukProfile from '../assets/images/tuk.png';
import '../assets/styles/home.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [feeStatement, setFeeStatement] = useState([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const [admissionNumber, setAdmissionNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [feeBalance, setFeeBalance] = useState('0');

  const handleLogOut = () => {
    const confirmLogOut = window.confirm("Are you sure you want to logout?");
    if (confirmLogOut) {
        
        navigate('/login');
    }}
    ;
  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost/api/student/${admissionNumber}`);
      console.log('API Response:', response.data);
  
      if (response.data && response.data.student) {
         const { student } = response.data;
         console.log('Student Data:', student);
      
      
  
         setStudentName(student.studentName);
         setFeeBalance(student.feeBalance);
         setFeeStatement(student.feeStatement);
         setAdmissionNumber(student.admissionNumber);
      } else {
        setError('Student data is not available.');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [admissionNumber]);
  

  useEffect(() => {
    if (admissionNumber) {
      fetchStudentData();
    }
  }, [admissionNumber, fetchStudentData]);
  

  function handlePayments() {
    navigate('/payments');
  }

  function handleReceipt() {
    navigate('/receipt');
  }

  function handleExamCard() {
    if (feeBalance <= 0) {
      downloadExamCard();
    } else {
      setError(`Please clear your fee balance of Ksh ${feeBalance} before downloading the exam card.`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000); // Hide error message after 3 seconds
    }
  }

  function downloadExamCard() {
    const doc = new jsPDF();
    doc.text("Exam Card", 20, 10);
    doc.text(`Name: ${studentName}`, 20, 20);
    doc.text(`Admission Number: ${admissionNumber}`, 20, 30);
    doc.save('exam-card.pdf');
  }

  function downloadPDF() {
    const doc = new jsPDF();
    doc.text("Fee Statement", 20, 10);
    doc.text(`Name: ${studentName}`, 20, 20);
    doc.text(`Admission Number: ${admissionNumber}`, 20, 30);
    doc.text(`Fee Balance: Ksh ${feeBalance}`, 20, 40);

    doc.autoTable({
      startY: 60,
      head: [['Date', 'Description', 'Amount', 'Balance']],
      body: feeStatement.map(entry => [entry.date, entry.description, entry.amount, entry.balance]),
    });

    doc.save('fee-statement.pdf');
  }

  return (
    <div className="main-container">
      <div className="header-section">
        <nav className="header">
          <img className="tuk-profile" src={tukProfile} alt="TUK profile" />
          <h3>Fee Payment Portal</h3>

          <button className='logout-button' onClick={handleLogOut}>Logout</button>
        </nav>
      </div>

      <div className="main-section">
          <div className="details-class">
           <label>Name: {studentName || 'Loading...'}</label>
           <label>Fee Balance: Ksh {feeBalance || 'Loading...'}</label>
         </div>


        {showError && <div className="error-message">{error}</div>}
        <div className="button-class">
          <button className="payment-button" onClick={handlePayments}>Make Payment</button>
          <button className="receipt-button" onClick={handleReceipt}>Download Fee Payment Receipt</button>
          <button className="card-button" onClick={handleExamCard}>Download Exam Card</button>
        </div>

        <div className="fee-statement">
          <h4>Fee Statement</h4>
          <div className="detail-class">
            <label>Name: {studentName}</label>
            <label>Admission Number: {admissionNumber}</label>
            <label>Fee Balance: Ksh {feeBalance}</label>
          </div>
          <button className="pdf-button" onClick={downloadPDF}>Download PDF</button>
          <table id="fee-statement-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {feeStatement.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.description}</td>
                  <td>{entry.amount}</td>
                  <td>{entry.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer>
        <p>&copy; 2024 by Khamis Ali</p>
      </footer>
    </div>
  );
}

export default Home;
