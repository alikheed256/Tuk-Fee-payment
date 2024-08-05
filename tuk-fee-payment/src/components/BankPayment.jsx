import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/bankpayment.css";

function BankPayment() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { service } = location.state || {};

  function handleReferenceNumber(e) {
    setReferenceNumber(e.target.value);
  }

  function handlePayment(e) {
    e.preventDefault(); 
    navigate('/bankdetails', { state: { referenceNumber } });
  }

  return (
    <>
      <div className="bank-container">
        <form onSubmit={handlePayment}>
          <label className="service-class">Service : {service}</label>
          <label className="ref-class">Reference Number:</label>
          <input
            className="bank-input"
            type="text"
            value={referenceNumber}
            onChange={handleReferenceNumber}
            required
          />
          <button className="bank-button" type="submit">
            Make Payment
          </button>
        </form>
      </div>
    </>
  );
}

export default BankPayment;
