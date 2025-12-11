import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SimulatorPage from './pages/SimulatorPage'
import RequestPage from './pages/RequestPage'
import ManageRequestPage from "./pages/ManageRequestPage"
import EditRequestPage from "./pages/EditRequestPage"



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulador" element={<SimulatorPage />} />
        <Route path="/solicitar" element={<RequestPage />} />
        <Route path="/solicitudes" element={<ManageRequestPage />} />
        <Route path="/editar/:id" element={<EditRequestPage />} />
      </Routes>
    </>
  )
}

export default App

