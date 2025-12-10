import { useState } from "react"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"

function ManageRequestPage() {
  // Filtros
  const [emailFilter, setEmailFilter] = useState("")
  const [creditTypeFilter, setCreditTypeFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [orderByField, setOrderByField] = useState("createdAt_desc")

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const navigate = useNavigate()

  // Modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)
  const fetchRequests = async () => {
    setLoading(true)
    setSearched(true)

    try {
      let filters = []

      if (emailFilter) filters.push(where("email", "==", emailFilter))
      if (creditTypeFilter) filters.push(where("creditType", "==", creditTypeFilter))
      if (cityFilter) filters.push(where("city", "==", cityFilter))

      const baseQuery = query(collection(db, "requests"), ...filters)
      const snapshot = await getDocs(baseQuery)

      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Filtro por rango de montos
      if (minAmount) results = results.filter(r => r.amount >= Number(minAmount))
      if (maxAmount) results = results.filter(r => r.amount <= Number(maxAmount))

      // Ordenamientos en frontend
      switch (orderByField) {
        case "createdAt_desc":
          results.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
          break
        case "createdAt_asc":
          results.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0))
          break
        case "amount_desc":
          results.sort((a, b) => b.amount - a.amount)
          break
        case "amount_asc":
          results.sort((a, b) => a.amount - b.amount)
          break
        case "term_desc":
          results.sort((a, b) => b.term - a.term)
          break
        case "term_asc":
          results.sort((a, b) => a.term - b.term)
          break
      }

      setRequests(results)

    } catch (err) {
      console.error("Error cargando solicitudes:", err)
    } finally {
      setLoading(false)
    }
  }

  // Limpia todos los filtros
  const clearFilters = () => {
    setEmailFilter("")
    setCreditTypeFilter("")
    setCityFilter("")
    setMinAmount("")
    setMaxAmount("")
    setOrderByField("createdAt_desc")
    setRequests([])
    setSearched(false)
  }
  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "requests", idToDelete))
      setRequests(prev => prev.filter(req => req.id !== idToDelete))
      setShowDeleteModal(false)
      setIdToDelete(null)
    } catch {
      alert("Error al eliminar la solicitud. Verifica tu conexión.")
    }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4 text-center">Gestión de Solicitudes</h1>

      {/* Filtros */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="fw-bold mb-3">Filtros avanzados</h5>

        <div className="row g-3">

          {/* Email */}
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Correo"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>

          {/* Tipo de crédito */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={creditTypeFilter}
              onChange={(e) => setCreditTypeFilter(e.target.value)}
            >
              <option value="">Tipo de crédito</option>
              <option value="Crédito Libre Inversión">Libre Inversión</option>
              <option value="Crédito Vehículo">Vehículo</option>
              <option value="Crédito Vivienda">Vivienda</option>
              <option value="Crédito Educativo">Educativo</option>
              <option value="Crédito Empresarial">Empresarial</option>
              <option value="Crédito de Nómina">Nómina</option>
            </select>
          </div>

          {/* Ciudad */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ciudad"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Rango de montos */}
        <div className="row g-3 mt-2">

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Monto mínimo"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Monto máximo"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          {/* Ordenamiento */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={orderByField}
              onChange={(e) => setOrderByField(e.target.value)}
            >
              <option value="createdAt_desc">Fecha (recientes primero)</option>
              <option value="createdAt_asc">Fecha (antiguos primero)</option>
              <option value="amount_desc">Monto (mayor a menor)</option>
              <option value="amount_asc">Monto (menor a mayor)</option>
              <option value="term_desc">Plazo (mayor a menor)</option>
              <option value="term_asc">Plazo (menor a mayor)</option>
            </select>
          </div>

          {/* Botones */}
          <div className="col-md-2 d-flex gap-2">
            <button className="btn btn-primary w-50" onClick={fetchRequests}>
              Buscar
            </button>

            <button className="btn btn-secondary w-50" onClick={clearFilters}>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      {!loading && requests.length > 0 && (
        <div className="mt-4">
          {requests.map(req => (
            <div key={req.id} className="card shadow-sm mb-3">
              <div className="card-header bg-primary text-white d-flex justify-content-between">
                <strong>{req.creditType}</strong>

                <div>
                  <i
                    className="bi bi-pencil-square text-warning me-3"
                    style={{ cursor: "pointer", fontSize: "1.3rem" }}
                    onClick={() => navigate(`/editar/${req.id}`)}
                    title="Editar solicitud"
                  ></i>
                  <i
                    className="bi bi-trash-fill text-danger"
                    style={{ cursor: "pointer", fontSize: "1.3rem" }}
                    onClick={() => {
                      setIdToDelete(req.id)
                      setShowDeleteModal(true)
                    }}
                    title="Eliminar solicitud"
                  ></i>

                </div>
              </div>

              <div className="card-body">
                <h6 className="fw-bold text-secondary">Información Personal</h6>

                <p><strong>Nombre:</strong> {req.name}</p>
                <p><strong>Documento:</strong> {req.documentType} {req.documentNumber}</p>
                <p><strong>Ciudad:</strong> {req.city}</p>

                <h6 className="fw-bold mt-4 text-secondary">Información del Crédito</h6>
                <p><strong>Monto:</strong> ${req.amount.toLocaleString("es-CO")}</p>
                <p><strong>Plazo:</strong> {req.term} meses</p>
                <p><strong>Cuota mensual:</strong> ${req.monthlyFee.toLocaleString("es-CO")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-center">Cargando...</p>}

      {searched && !loading && requests.length === 0 && (
        <p className="text-center mt-4">No se encontraron solicitudes.</p>
      )}

      {/* Confirmación del eliminar */}
      {showDeleteModal && (
        <div 
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirmar eliminación</h5>
                <button 
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar esta solicitud?</p>
                <p className="text-muted">Esta acción no se puede deshacer.</p>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>

                <button 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default ManageRequestPage
