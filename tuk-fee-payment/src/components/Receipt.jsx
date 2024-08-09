
import { useEffect, useState } from "react";



function Receipt() {

    const [serialnumber, setSerialNumber] = useState();
    const [currentDate, setCurrentDate] = useState();
    const [currentTime, setCurrentTime] = useState();

    const serialNumberGenerator = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let serial = '';

        for (let i = 0; i < 10; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
            
        }
        return serial;
    };

    const getCurrentTimeDate = ()=> {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        
        return {date, time};
    };

    useEffect (()=>{
        setSerialNumber(serialNumberGenerator());
        const {date,time} = getCurrentTimeDate();
        setCurrentDate(date);
        setCurrentTime(time);

    }, []);





    

    return (
          <div className="reciept-contaier">
            <div className="receipt-details"> 
                <p>SNO: {serialnumber}</p>
                <h5>Fee Statement</h5>
                <p>Time: {currentTime}</p>
                <p>Date: {currentDate}</p>
                <p>Signature:_____________________</p>

            </div>
             
          </div>
       
          
          
    );
    
}

export default Receipt