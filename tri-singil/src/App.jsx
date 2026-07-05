import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import InstallPrompt from './components/InstallPrompt'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <InstallPrompt />
    </BrowserRouter>
  )
}

export default App
