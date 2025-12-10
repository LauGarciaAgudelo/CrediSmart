import { useState } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

function MyRequestPage() {
  const [emailFilter, setEmailFilter] = useState("")
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const fetchRequests = async () => {
    if (!emailFilter) return

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const q = query(
        collection(db, "requests"),
        where("email", "==", emailFilter),
        orderBy("createdAt", "desc")
      )

      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      setRequests(data)

    } catch (err) {
      console.error(err)
      setError("No se pudieron cargar las solicitudes. Verifica tu conexión a internet.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4 text-center">Mis Solicitudes</h1>

      {/* Filtrado */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="fw-bold mb-3">Buscar solicitudes por correo</h5>

        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>

          <div className="col-md-3 d-grid">
            <button
              className="btn btn-primary"
              onClick={fetchRequests}
              disabled={!emailFilter || loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      {/* Carga */}
      {loading && (
        <p className="text-center mt-4">Cargando solicitudes...</p>
      )}

      {/* Manejo de Error */}
      {error && (
        <p className="text-center text-danger mt-3">{error}</p>
      )}

      {/* Vacío */}
      {searched && !loading && requests.length === 0 && !error && (
        <p className="text-center mt-4">
          No se encontraron solicitudes para este correo.
        </p>
      )}

      {/* Resultados */}
      {!loading && requests.length > 0 && (
        <div className="mt-4">
          {requests.map(req => (
            <div key={req.id} className="card shadow-sm mb-3">
              <div className="card-header bg-primary text-white">
                <strong>Solicitud de crédito: {req.creditType}</strong>
              </div>

              <div className="card-body">

                {/* SECCIÓN 1 – Información Personal */}
                <h6 className="fw-bold text-secondary">Información Personal</h6>
                <p className="mb-1"><strong>Nombre:</strong> {req.name}</p>
                <p className="mb-1"><strong>Documento:</strong> {req.documentType} {req.documentNumber}</p>
                <p className="mb-1"><strong>Fecha de nacimiento:</strong> {req.birthDate}</p>
                <p className="mb-1"><strong>Teléfono:</strong> {req.phone}</p>
                <p className="mb-1"><strong>Correo:</strong> {req.email}</p>
                <p className="mb-1"><strong>Dirección:</strong> {req.address}</p>
                <p className="mb-1"><strong>Ciudad:</strong> {req.city}</p>
                <p className="mb-3"><strong>Estado civil:</strong> {req.maritalStatus}</p>

                <p className="mb-4">
                  <strong>Ingresos mensuales:</strong> ${req.monthlyIncome?.toLocaleString("es-CO")}
                </p>

                <hr />

                {/* SECCIÓN 2 – Información del Crédito */}
                <h6 className="fw-bold text-secondary">Información del Crédito</h6>
                <p className="mb-1"><strong>Monto solicitado:</strong> ${req.amount?.toLocaleString("es-CO")}</p>
                <p className="mb-1"><strong>Plazo:</strong> {req.term} meses</p>
                <p className="mb-1"><strong>Cuota mensual:</strong> ${req.monthlyFee?.toLocaleString("es-CO")}</p>
                <p className="mb-1"><strong>Total a pagar:</strong> ${req.totalToPay?.toLocaleString("es-CO")}</p>
                <p className="mb-1"><strong>Intereses:</strong> ${req.interests?.toLocaleString("es-CO")}</p>

                <p className="mt-3 text-muted">
                  <strong>Fecha de creación:</strong>{" "}
                  {req.createdAt?.toDate().toLocaleString() ?? "No disponible"}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default MyRequestPage
