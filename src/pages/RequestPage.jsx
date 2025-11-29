import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import creditsData from '../data/creditsData'

function RequestPage() {
  // Obtener el crédito enviado desde CreditCard.jsx
  const location = useLocation()
  const preselected = location.state?.selectedCredit || ""

  // Estados del formulario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [term, setTerm] = useState('')
  const [creditType, setCreditType] = useState(preselected)
  const [errors, setErrors] = useState({})

  // Resumen final
  const [submittedData, setSubmittedData] = useState(null)

  // Array temporal con solicitudes en memoria
  const [requests, setRequests] = useState([])
  const getCreditRate = () => {
    const credit = creditsData.find(c => c.name === creditType)
    if (!credit) return null

    // Se convierte tasa anual (%) a tasa mensual decimal
    return credit.annualRate / 12 / 100
  }

  //  Cálculo de cuota mensual (valor derivado)

  const tasaMensual = getCreditRate()

  let monthlyFee = null
  if (tasaMensual && amount > 0 && term > 0) {
    const cuota = (amount * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -term))
    monthlyFee = Math.round(cuota)
  }

  const totalToPay = monthlyFee && term ? monthlyFee * term : 0
  const interests =
    totalToPay > 0 && amount > 0
      ? Math.max(totalToPay - amount, 0)
      : 0

  const validate = () => {
    const newErrors = {}

    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.'
    if (!email.includes('@')) newErrors.email = 'Correo inválido.'
    if (!amount || amount <= 0) newErrors.amount = 'Monto inválido.'
    if (!term || term <= 0) newErrors.term = 'Plazo inválido.'
    if (!creditType) newErrors.creditType = 'Selecciona un tipo de crédito.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejo del input con formato de miles
  const handleAmountFormatted = (e) => {
    const raw = e.target.value
      .replace(/\./g, '')
      .replace(/,/g, '')

    setAmount(Number(raw))
  }

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    const newRequest = {
      name,
      email,
      amount,
      term,
      creditType,
      monthlyFee,
      date: new Date().toLocaleString()
    }

    // Guardar la solicitud en memoria
    setRequests([...requests, newRequest])
    setSubmittedData(newRequest)

    // Limpiar formulario
    setName('')
    setEmail('')
    setAmount('')
    setTerm('')
    setCreditType('')
  }
  return (
    <main>
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="mb-3">Solicitud de Crédito</h1>
          <p className="lead">Completa la información para registrar tu solicitud.</p>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          
          {/* FORMULARIO PRINCIPAL */}
          <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
            
            <h4 className="mb-3">Datos del Solicitante</h4>

            {/* Nombre */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            {/* Tipo de crédito */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Tipo de crédito</label>
              <select
                className="form-select"
                value={creditType}
                onChange={(e) => setCreditType(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option value="Crédito Libre Inversión">Crédito Libre Inversión</option>
                <option value="Crédito Vehículo">Crédito Vehículo</option>
                <option value="Crédito Vivienda">Crédito Vivienda</option>
                <option value="Crédito Educativo">Crédito Educativo</option>
                <option value="Crédito Empresarial">Crédito Empresarial</option>
                <option value="Crédito de Nómina">Crédito de Nómina</option>
              </select>
              {errors.creditType && <small className="text-danger">{errors.creditType}</small>}
            </div>

            {/* Monto con formato */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Monto solicitado</label>
              <input
                type="text"
                className="form-control"
                value={amount ? amount.toLocaleString('es-CO') : ""}
                onChange={handleAmountFormatted}
              />
              {errors.amount && <small className="text-danger">{errors.amount}</small>}
            </div>

            {/* Plazo */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Plazo (meses)</label>
              <input
                type="number"
                className="form-control"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
              />
              {errors.term && <small className="text-danger">{errors.term}</small>}
            </div>

            {/* Simulación del crédito */}
            {monthlyFee && (
              <div className="alert alert-info">
                <h5 className="fw-bold mb-2">Simulación del crédito</h5>

                <p className="mb-1">
                  <strong>Cuota mensual estimada:</strong> ${monthlyFee.toLocaleString()}
                </p>

                <p className="mb-1">
                  <strong>Total a pagar:</strong> ${totalToPay.toLocaleString()}
                </p>

                <p className="mb-3">
                  <strong>Intereses estimados:</strong> ${interests.toLocaleString()}
                </p>

                <hr />

                <p className="mb-0">
                  Si estás de acuerdo con esta simulación y deseas continuar con la solicitud,
                  completa los campos restantes y haz clic en <strong>Enviar solicitud</strong>.
                </p>
              </div>
            )}

            <div className="text-end">
              <button className="btn btn-primary px-4">Enviar solicitud</button>
            </div>
          </form>

          {/* Resumen final */}
          {submittedData && (
            <div className="alert alert-success mt-4">
              <h5 className="fw-bold">Solicitud enviada con éxito</h5>
              <p><strong>Nombre:</strong> {submittedData.name}</p>
              <p><strong>Correo:</strong> {submittedData.email}</p>
              <p><strong>Tipo crédito:</strong> {submittedData.creditType}</p>
              <p><strong>Monto:</strong> ${submittedData.amount.toLocaleString()}</p>
              <p><strong>Plazo:</strong> {submittedData.term} meses</p>
              <p><strong>Cuota mensual:</strong> ${submittedData.monthlyFee?.toLocaleString()}</p>
              <p><strong>Fecha:</strong> {submittedData.date}</p>
            </div>
          )}

        </div>
      </section>
    </main>
  )
}

export default RequestPage
