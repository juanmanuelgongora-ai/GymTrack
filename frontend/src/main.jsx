import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos/index.css'
import App from './App.jsx'
import { UserProvider } from './logica/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
