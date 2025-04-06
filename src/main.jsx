import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextSharing from './Context/ContextSharing.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <ContextSharing>
         <App />
         </ContextSharing>

  </StrictMode>,
)
