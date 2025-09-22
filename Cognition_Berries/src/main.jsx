import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './Context/AppContext.jsx'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ✅ load config from environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase once, here
initializeApp(firebaseConfig);
const analytics = getAnalytics(initializeApp);

createRoot(document.getElementById('root')).render(
  <AppContextProvider>

    <StrictMode>
      <App />
    </StrictMode>,
  </AppContextProvider>
)
