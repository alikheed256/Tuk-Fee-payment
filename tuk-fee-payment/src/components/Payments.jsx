import React from 'react';
import { useNavigate } from 'react-router-dom';
import tukProfile from '../assets/images/tuk.png';
import '../assets/styles/payment.css'

function Payments() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/home');
  };

  const handlePayment = (service) => {
    navigate('/payoption', { state: { service } });
  };

  const services = [
    "Programme Fee",
    "Supplementary Examinations",
    "Failed Units Fee",
    "Hostel Accommodation",
    "Graduation Fee",
    "Student ID Replacement",
    "Transcript Replacement",
    "Certification"
  ];

  return (
    <div>
      <div className="header-section">
        <nav className="header">
          <img className="tuk-profile" src={tukProfile} alt="tuk profile" />
          <h3>Fee Payment Portal</h3>
        </nav>
      </div>
       <div className="main-container">
       <div className="payment-details">
        <h4>Choose the service you want to make payment for.</h4>
        <ul>
          {services.map((service, index) => (
            <li key={index} onClick={() => handlePayment(service)}>
              {service}
            </li>
          ))}
        </ul>
        
      </div>

       </div>

       <button className='cancel-button' onClick={handleCancel}>Cancel</button>
      
    </div>
  );
}

export default Payments;
