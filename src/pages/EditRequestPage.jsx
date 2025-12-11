import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db } from "../firebase/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import creditsData from "../data/creditsData"

function EditRequestPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Modal de éxito
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
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
  })

  const [monthlyFee, setMonthlyFee] = useState(null)
  const [totalToPay, setTotalToPay] = useState(0)
  const [interests, setInterests] = useState(0)

  // Carga datos desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, "requests", id)
        const snapshot = await getDoc(ref)

        if (!snapshot.exists()) {
          setError("La solicitud no existe o fue eliminada.")
          setLoading(false)
          return
        }

        const data = snapshot.data()

        setForm({
          name: data.name || "",
          documentType: data.documentType || "",
          documentNumber: data.documentNumber || "",
          birthDate: data.birthDate || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          maritalStatus: data.maritalStatus || "",
          email: data.email || "",
          monthlyIncome: data.monthlyIncome || "",
          creditType: data.creditType || "",
          amount: data.amount || 0,
          term: data.term || 0,
        })

      } catch {
        setError("Error al cargar la solicitud.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Recalcular cuotas
  useEffect(() => {
    if (!form.creditType) return

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
        : value,
    }))
  }

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const ref = doc(db, "requests", id)

      await updateDoc(ref, {
        ...form,
        monthlyFee,
        totalToPay,
        interests,
      })

      setShowModal(true)

    } catch {
      setError("No se pudo actualizar la información. Intenta nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center mt-5">Cargando solicitud...</p>
  if (error) return <p className="text-center text-danger mt-5">{error}</p>

  return (
    <main className="container py-4">
      <h2 className="mb-4 text-center">Editar Solicitud</h2>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>

        <h4 className="text-primary mb-3">Información Personal</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input className="form-control"
              name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Tipo de documento</label>
            <select className="form-select"
              name="documentType" value={form.documentType} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PAS">Pasaporte</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Número de documento</label>
            <input className="form-control"
              name="documentNumber" value={form.documentNumber} onChange={handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Fecha de nacimiento</label>
            <input type="date" className="form-control"
              name="birthDate" value={form.birthDate} onChange={handleChange} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Teléfono</label>
            <input className="form-control"
              name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Ciudad</label>
            <input className="form-control"
              name="city" value={form.city} onChange={handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Dirección</label>
            <input className="form-control"
              name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Estado civil</label>
            <select className="form-select"
              name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Unión Libre">Unión Libre</option>
              <option value="Divorciado">Divorciado</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-semibold">Ingresos mensuales</label>
            <input type="number" className="form-control"
              name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} />
          </div>
        </div>

        <hr className="my-4" />

        {/* Información del Crédito */}
        <h4 className="text-primary mb-3">Información del Crédito</h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Tipo de crédito</label>
            <select className="form-select"
              name="creditType" value={form.creditType} onChange={handleChange}>
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
            <input type="number" className="form-control"
              name="amount" value={form.amount} onChange={handleChange} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Plazo (meses)</label>
            <input type="number" className="form-control"
              name="term" value={form.term} onChange={handleChange} />
          </div>
        </div>

        {/* Simulación del crédito */}
        {monthlyFee && (
          <div className="alert alert-info mt-3">
            <h5 className="fw-bold">Simulación Actualizada</h5>
            <p><strong>Cuota mensual:</strong> ${monthlyFee.toLocaleString()}</p>
            <p><strong>Total a pagar:</strong> ${totalToPay.toLocaleString()}</p>
            <p><strong>Intereses:</strong> ${interests.toLocaleString()}</p>
          </div>
        )}

        <div className="text-end mt-4">
          <button className="btn btn-primary px-4" disabled={saving}>
            {saving ? "Guardando cambios..." : "Guardar cambios"}
          </button>
        </div>

      </form>

      {/* Modal edición exitosa */}
      {showModal && (
        <div 
          className="modal fade show" 
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Solicitud actualizada</h5>
                <button 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>La solicitud ha sido editada con éxito.</p>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Seguir editando
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/solicitudes")}
                >
                  Volver al menú
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default EditRequestPage
