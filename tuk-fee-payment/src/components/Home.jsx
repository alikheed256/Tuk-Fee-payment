import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tukProfile from '../assets/images/tuk.png';
import '../assets/styles/home.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import html2canvas from 'html2canvas';

function Home() {
  const navigate = useNavigate();
  const [feeStatement, setFeeStatement] = useState([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [course, setCourse] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [feeBalance, setFeeBalance] = useState('0');
  const [serialNumber, setSerialNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const amountPaid = useState('');

  useEffect(() => {
    setSerialNumber(generateSerialNumber());
    const { date, time } = getCurrentDateTime();
    setCurrentDate(date);
    setCurrentTime(time);
  }, []);

  const handleLogOut = () => {
    const confirmLogOut = window.confirm("Are you sure you want to logout?");
    if (confirmLogOut) {
      navigate('/login');
    }
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return { date, time };
  };


  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:3000/api/student/${admissionNumber}`);
      console.log('API Response:', response.data);

      if (response.data && response.data.student) {
        const { student } = response.data;
        console.log('Student Data:', student);

        setStudentName(student.studentName);
        setFeeBalance(student.feeBalance);
        setFeeStatement(student.feeStatement);
        setCourse(student.course);
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

  const handlePayments = () => {
    navigate('/payments');
  };

  

  const generateSerialNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = '';
    for (let i = 0; i < 10; i++) {
      serial += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return serial;
  };


  const downloadExamCard = () => {
    const receiptElement = document.getElementById('feereceipt');
    if (!receiptElement) {
      console.error('Element with ID "feereceipt" not found.');
      return;
    }
  
    const originalDisplay = receiptElement.style.display;
    receiptElement.style.display = 'block';
  
    const scale = 4;
    html2canvas(receiptElement, { scale }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF('portrait', 'mm', 'a5');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('exam-card.pdf');
      
    
      receiptElement.style.display = originalDisplay;

    }).catch(error => {
      console.error('Error generating exam card:', error);
    });
  };
  
  const handleExamCard = () => {
    if (Number(feeBalance) <= 0) {  
      downloadExamCard();
    } else {
      setError(`Please clear your fee balance of Ksh ${feeBalance} before downloading the exam card.`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const downloadPDF = () => {
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
  };

  const downloadFeeReceipt = () => {
    const doc = new jsPDF('landscape', 'mm', 'a5');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const watermarkImage =tukProfile; 
    doc.addImage(watermarkImage, 'PNG', pageWidth / 4, pageHeight / 4, pageWidth / 2, pageHeight / 2, '', 'FAST');
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setLineDash([5, 5], 0);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setFontSize(16);
    doc.text(`Fee Payment Receipt`, pageWidth / 2, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Name: ${studentName}`, 20, 50);
    doc.text(`Admission Number: ${admissionNumber}`, 20, 60);
    doc.text(`Course: ${course}`, 20, 70);
    doc.text(`Amount Paid: Ksh ${amountPaid}`, 20, 80);
    doc.text(`Date: ${currentDate}`, 20, 90);
    doc.text(`Time: ${currentTime}`, 20, 100);
  
    doc.save('fee-payment-receipt.pdf');
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
          <button className="receipt-button" onClick={downloadFeeReceipt}>Download Fee Payment Receipt</button>
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

        <div className="fee-container">
        <div id="feereceipt" style={{ display: 'none' }}>
          <h2 className='head-section'>Examination Card</h2>
          <p className="serial-number"> SNO: {serialNumber}</p>
          <p className='student-details' >Name: {studentName}</p>
          <p className='student-details'>Admission Number: {admissionNumber}</p>
          <p className='student-details'>Course: {course}</p>
          <p className='student-details'>Fee Balance: Ksh {feeBalance}</p>
          <p className="date-time">Time: {currentTime}</p>
          <p className="date-time">Date: {new Date().toLocaleDateString()}</p>
          <p className="signature">Signature:_____________________</p>
        </div>
        </div>
      </div>

      <footer>
        <p>&copy; 2024 by Khamis Ali</p>
      </footer>
    </div>
  );
}

export default Home;
