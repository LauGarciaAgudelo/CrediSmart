import { useState, useEffect } from "react"
import creditsData from "../data/creditsData"
import { db } from "../firebase/firebaseConfig"
import { collection, addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

function RequestPage() {
  const navigate = useNavigate()

  const initialState = {
    name: "",
    documentType: "",
    documentNumber: "",
    birthDate: "",
    phone: "",
    address: "",
    city: "",
    maritalStatus: "",
    email: "",
    monthlyIncome: "",
    creditType: "",
    amount: "",
    term: "",
  }

  const [form, setForm] = useState(initialState)

  const [monthlyFee, setMonthlyFee] = useState(null)
  const [totalToPay, setTotalToPay] = useState(0)
  const [interests, setInterests] = useState(0)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // MODAL DE ÉXITO
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Asegurar que el modal sea visible al activarse
  useEffect(() => {
    if (showSuccessModal) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [showSuccessModal])

  // Cálculo automático de cuota
  useEffect(() => {
    if (!form.creditType || !form.amount || !form.term) return

    const credit = creditsData.find(c => c.name === form.creditType)
    if (!credit) return

    const tasaMensual = credit.annualRate / 12 / 100

    if (form.amount > 0 && form.term > 0) {
      const cuota = (form.amount * tasaMensual) /
        (1 - Math.pow(1 + tasaMensual, -form.term))

      const rounded = Math.round(cuota)
      setMonthlyFee(rounded)
      setTotalToPay(rounded * form.term)
      setInterests(rounded * form.term - form.amount)
    }
  }, [form.amount, form.term, form.creditType])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: ["amount", "term", "monthlyIncome"].includes(name)
        ? Number(value)
        : value
    }))
  }

  // Guardar solicitud
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await addDoc(collection(db, "requests"), {
        ...form,
        monthlyFee,
        totalToPay,
        interests,
        createdAt: new Date()
      })

      setShowSuccessModal(true)
      setForm(initialState)

    } catch {
      setError("Hubo un error al guardar la solicitud.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container py-4">
      <h2 className="mb-4 text-center">Solicitar Crédito</h2>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>

        {/* INFORMACIÓN PERSONAL */}
        <h4 className="text-primary mb-3">Información Personal</h4>

        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input 
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Tipo de documento</label>
            <select
              className="form-select"
              name="documentType"
              value={form.documentType}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PAS">Pasaporte</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Número de documento</label>
            <input
              className="form-control"
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        {/* MÁS CAMPOS */}
        <div className="row">

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Fecha de nacimiento</label>
            <input 
              type="date"
              className="form-control"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Teléfono</label>
            <input 
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Ciudad</label>
            <input 
              className="form-control"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        {/* DIRECCIÓN / INGRESOS */}
        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Dirección</label>
            <input 
              className="form-control"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Estado civil</label>
            <select
              className="form-select"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Unión Libre">Unión Libre</option>
              <option value="Divorciado">Divorciado</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Ingresos mensuales</label>
            <input 
              type="number"
              className="form-control"
              name="monthlyIncome"
              value={form.monthlyIncome}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <hr className="my-4" />

        {/* INFORMACIÓN DEL CRÉDITO */}
        <h4 className="text-primary mb-3">Información del Crédito</h4>

        <div className="row">

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Tipo de crédito</label>
            <select
              className="form-select"
              name="creditType"
              value={form.creditType}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="Crédito Libre Inversión">Libre Inversión</option>
              <option value="Crédito Vehículo">Vehículo</option>
              <option value="Crédito Vivienda">Vivienda</option>
              <option value="Crédito Educativo">Educativo</option>
              <option value="Crédito Empresarial">Empresarial</option>
              <option value="Crédito de Nómina">Nómina</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Monto</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Plazo (meses)</label>
            <input
              type="number"
              className="form-control"
              name="term"
              value={form.term}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        {/* SIMULACIÓN */}
        {monthlyFee && (
          <div className="alert alert-info mt-3">
            <h5 className="fw-bold">Simulación de Crédito</h5>
            <p><strong>Cuota mensual:</strong> ${monthlyFee.toLocaleString()}</p>
            <p><strong>Total a pagar:</strong> ${totalToPay.toLocaleString()}</p>
            <p><strong>Intereses:</strong> ${interests.toLocaleString()}</p>
          </div>
        )}

        <div className="text-end mt-4">
          <button className="btn btn-primary px-4" disabled={saving}>
            {saving ? "Guardando..." : "Enviar solicitud"}
          </button>
        </div>

        {error && (
          <p className="text-danger mt-3">{error}</p>
        )}

      </form>

      {/* 🌟 MODAL DE CONFIRMACIÓN DE ÉXITO */}
      {showSuccessModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title text-success">Solicitud creada</h5>
                <button 
                  className="btn-close"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>Tu solicitud fue registrada exitosamente.</p>
                <p className="text-muted">¿Qué deseas hacer ahora?</p>
              </div>

              <div className="modal-footer">

                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Crear otra
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/solicitudes")}
                >
                  Ir al menú
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default RequestPage
