import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ConfigErrorScreen from './components/ConfigErrorScreen'
import { isSupabaseConfigured } from './lib/supabaseClient'

createRoot(document.getElementById('root')).render(
  <StrictMode>{isSupabaseConfigured ? <App /> : <ConfigErrorScreen />}</StrictMode>
)
