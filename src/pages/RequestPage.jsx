import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import creditsData from '../data/creditsData'
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

function RequestPage() {
  const location = useLocation()
  const preselected = location.state?.selectedCredit || ""

  // Información personal
  const [name, setName] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [email, setEmail] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')

  // Información del crédito
  const [creditType, setCreditType] = useState(preselected)
  const [amount, setAmount] = useState('')
  const [term, setTerm] = useState('')

  // Estados UI
  const [errors, setErrors] = useState({})
  const [submittedData, setSubmittedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [firebaseError, setFirebaseError] = useState(null)

  // Obtener tasa real del crédito
  const getCreditRate = () => {
    const credit = creditsData.find(c => c.name === creditType)
    if (!credit) return null
    return credit.annualRate / 12 / 100
  }

  // Cálculos
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

  // Validaciones completas
  const validate = () => {
    const newErrors = {}

    // Sección personal
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.'
    if (!documentType) newErrors.documentType = 'Selecciona un tipo de documento.'
    if (!documentNumber) newErrors.documentNumber = 'El número de documento es obligatorio.'
    if (!birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria.'
    if (!phone) newErrors.phone = 'El teléfono es obligatorio.'
    if (!address.trim()) newErrors.address = 'La dirección es obligatoria.'
    if (!city.trim()) newErrors.city = 'La ciudad es obligatoria.'
    if (!maritalStatus) newErrors.maritalStatus = 'Selecciona un estado civil.'
    if (!email.includes('@')) newErrors.email = 'Correo inválido.'
    if (!monthlyIncome || monthlyIncome <= 0) newErrors.monthlyIncome = 'Los ingresos mensuales son obligatorios.'

    // Sección de crédito
    if (!creditType) newErrors.creditType = 'Selecciona un tipo de crédito.'
    if (!amount || amount <= 0) newErrors.amount = 'Monto inválido.'
    if (!term || term <= 0) newErrors.term = 'Plazo inválido.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Formateo de miles
  const handleAmountFormatted = (e) => {
    const raw = e.target.value.replace(/\./g, '').replace(/,/g, '')
    setAmount(Number(raw))
  }

  // Enviar solicitud
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setFirebaseError(null)

    try {
      await addDoc(collection(db, "requests"), {
        name,
        documentType,
        documentNumber,
        birthDate,
        phone,
        address,
        city,
        maritalStatus,
        email,
        monthlyIncome,
        creditType,
        amount,
        term,
        monthlyFee,
        totalToPay,
        interests,
        createdAt: serverTimestamp(),
      })

      setSubmittedData({
        name,
        email,
        creditType,
        amount,
        term,
        monthlyFee,
        date: new Date().toLocaleString(),
      })

      // Limpiar formulario
      setName('')
      setDocumentType('')
      setDocumentNumber('')
      setBirthDate('')
      setPhone('')
      setAddress('')
      setCity('')
      setMaritalStatus('')
      setEmail('')
      setMonthlyIncome('')
      setCreditType('')
      setAmount('')
      setTerm('')

    } catch (err) {
      console.error(err)
      setFirebaseError("Ocurrió un error al guardar la solicitud. Verifica tu conexión.")
    } finally {
      setLoading(false)
    }
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

          {/* FORMULARIO */}
          <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>

            {/* ------------------------------ */}
            {/*  SECCIÓN 1: INFORMACIÓN PERSONAL */}
            {/* ------------------------------ */}

            <h4 className="mb-3 text-primary">Información Personal</h4>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nombre completo</label>
                <input type="text" className="form-control"
                  value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Tipo de documento</label>
                <select className="form-select"
                  value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
                {errors.documentType && <small className="text-danger">{errors.documentType}</small>}
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Número de documento</label>
                <input type="number" className="form-control"
                  value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                {errors.documentNumber && <small className="text-danger">{errors.documentNumber}</small>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Fecha de nacimiento</label>
                <input type="date" className="form-control"
                  value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Teléfono</label>
                <input type="text" className="form-control"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <small className="text-danger">{errors.phone}</small>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Ciudad</label>
                <input type="text" className="form-control"
                  value={city} onChange={(e) => setCity(e.target.value)} />
                {errors.city && <small className="text-danger">{errors.city}</small>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Dirección</label>
                <input type="text" className="form-control"
                  value={address} onChange={(e) => setAddress(e.target.value)} />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Estado civil</label>
                <select className="form-select"
                  value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="Soltero">Soltero</option>
                  <option value="Casado">Casado</option>
                  <option value="Unión Libre">Unión Libre</option>
                  <option value="Divorciado">Divorciado</option>
                </select>
                {errors.maritalStatus && <small className="text-danger">{errors.maritalStatus}</small>}
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Ingresos mensuales</label>
                <input type="number" className="form-control"
                  value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} />
                {errors.monthlyIncome && <small className="text-danger">{errors.monthlyIncome}</small>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input type="email" className="form-control"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <hr className="my-4" />

            {/* ------------------------------ */}
            {/*  SECCIÓN 2: INFORMACIÓN DEL CRÉDITO */}
            {/* ------------------------------ */}

            <h4 className="mb-3 text-primary">Información del Crédito</h4>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Tipo de crédito</label>
                <select className="form-select"
                  value={creditType} onChange={(e) => setCreditType(e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="Crédito Libre Inversión">Crédito Libre Inversión</option>
                  <option value="Crédito Vehículo">Crédito Vehículo</option>
                  <option value="Crédito Vivienda">Crédito Vivienda</option>
                  <option value="Crédito Educativo">Crédito Educativo</option>
                  <option value="Crédito Empresarial">Crédito Empresarial</option>
                  <option value="Crédito de Nómina">Crédito de Nómina</option>
                </select>
                {errors.creditType && <small className="text-danger">{errors.creditType}</small>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Monto solicitado</label>
                <input type="text" className="form-control"
                  value={amount ? amount.toLocaleString('es-CO') : ""}
                  onChange={handleAmountFormatted} />
                {errors.amount && <small className="text-danger">{errors.amount}</small>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Plazo (meses)</label>
                <input type="number" className="form-control"
                  value={term} onChange={(e) => setTerm(Number(e.target.value))} />
                {errors.term && <small className="text-danger">{errors.term}</small>}
              </div>
            </div>

            {/* SIMULACIÓN */}
            {monthlyFee && (
              <div className="alert alert-info mt-3">
                <h5 className="fw-bold">Simulación del Crédito</h5>
                <p><strong>Cuota mensual:</strong> ${monthlyFee.toLocaleString()}</p>
                <p><strong>Total a pagar:</strong> ${totalToPay.toLocaleString()}</p>
                <p><strong>Intereses:</strong> ${interests.toLocaleString()}</p>
              </div>
            )}

            <div className="text-end mt-4">
              <button className="btn btn-primary px-4" disabled={loading}>
                {loading ? "Guardando..." : "Enviar solicitud"}
              </button>
            </div>

            {firebaseError && (
              <p className="text-danger mt-3">{firebaseError}</p>
            )}
          </form>

          {/* RESUMEN FINAL */}
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
