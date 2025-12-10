import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SimulatorPage from './pages/SimulatorPage'
import RequestPage from './pages/RequestPage'
import MyRequestPage from "./pages/MyRequestPage"


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulador" element={<SimulatorPage />} />
        <Route path="/solicitar" element={<RequestPage />} />
        <Route path="/mis-solicitudes" element={<MyRequestPage />} />
      </Routes>
    </>
  )
}

export default App

