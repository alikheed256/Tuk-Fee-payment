import { useNavigate, useLocation } from "react-router-dom";
import '../assets/styles/payoption.css'

function PayOption() {

  const navigate = useNavigate();
  const location = useLocation();
  const {service} = location.state  || {};


  const handleBankPayment =()=> {
    navigate('/bankpayment', {state: {service}}) ;

  };

  const handleMpesaPayment = () => {

    navigate('/mpesapayment', {state: {service}});

  };


  const handleCancel =()=>{
    navigate('/payments')
  }
  


    return (
        <>
          <div className="option-class">
            <div className="pay-class">
              <p>Select the mode of payment here.</p>
                <label className="label-class" >Service :    {service}</label>
                
              <div className="payment-buttons">
                  <button className="bank-button"  onClick={handleBankPayment}>Bank Reference Number</button>
                  <button className="mpesa-button" onClick={handleMpesaPayment}>Mpesa</button>
                 
              </div>
              
            </div>
          </div>

          <div>
            <button className='back-button' onClick={handleCancel}>Cancel</button>
            </div>

        </>
    );
    
}

export default PayOption;