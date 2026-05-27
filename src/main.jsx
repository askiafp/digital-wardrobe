import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Closetry from './App.jsx' // Ubah App menjadi Closetry

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Closetry />
  </StrictMode>,
)