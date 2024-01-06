import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import { clientID } from './secretKeys/keys';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientID}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
