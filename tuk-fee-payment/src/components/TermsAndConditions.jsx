import { useNavigate } from 'react-router-dom'
import '../assets/styles/terms.css'
function TermsAndConditions() {
    const navigate = useNavigate();


    const setTermsAndConditions = () =>{

        navigate('/signup')


    }

    
    return (
        <>
        <div className="terms-conditions">
            <p>This is the TUK Fee Payment System, and you are ONLY allowed to sign in if you are a student at The Technical University of Kenya (TUK).</p>
            <p>Please use your student admission number as your username and choose your preferred password.</p>
            <p>You can only log in if you use the correct credentials provided during the sign-up process.</p>
            <p>Using another student's details to sign into the portal is strictly prohibited and constitutes a violation of university policy.</p>

        </div>

        <button className='terms-button' onClick={setTermsAndConditions}>EXIT</button>

        </>
    )
}

export default TermsAndConditions