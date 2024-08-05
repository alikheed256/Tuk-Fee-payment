import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId = "306002431244-mqbutc3r9igqukabl22j3cnf994a0g08.apps.googleusercontent.com">

    <React.StrictMode>
    <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
 
)
