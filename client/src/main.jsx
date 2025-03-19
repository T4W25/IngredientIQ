import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Auth from "./components/authorization/Auth"; 
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth />
  </StrictMode>,
)
