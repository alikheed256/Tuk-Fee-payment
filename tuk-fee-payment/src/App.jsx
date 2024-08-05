import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Receipt from './components/Receipt';
import TermsAndConditions from './components/TermsAndConditions';
import Payments from './components/Payments';
import PayOption from './components/PayOption';
import MpesaPayment from './components/MpesaPayment';
import BankPayment from './components/BankPayment';
import BankDetails from './components/BankDetails';

const App = () => {

   
  
    return (
        
            <Router>
                <AuthProvider>
                <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<ProtectedRoute component={Home} />} />
                    <Route path="/receipt" element={<ProtectedRoute component={Receipt} />} />
                    <Route path="/payments" element={<ProtectedRoute component={Payments} />} />
                    <Route path="/payoption" element={<ProtectedRoute component={PayOption} />} />
                    <Route path="/mpesapayment" element={<ProtectedRoute component={MpesaPayment} />} />
                    <Route path="/bankpayment" element={<ProtectedRoute component={BankPayment} />} />
                    <Route path='/bankdetails' element = {<ProtectedRoute component={BankDetails}/>} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
                </AuthProvider>
            </Router>
       
    );
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth();

    return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default App;
