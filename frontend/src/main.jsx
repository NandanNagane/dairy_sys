import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { QueryProvider } from './providers/QueryProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster />
    </QueryProvider>
  </StrictMode>
)
