import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import { CreateContextProvider } from './context/myContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <CreateContextProvider>
      <App />
    </CreateContextProvider>
  </StrictMode>,
)
