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

      {/* Filtro por email */}
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

      {/* Mensaje de estado para avisar al usuario */}
      {loading && (
        <p className="text-center mt-4">Cargando solicitudes...</p>
      )}

      {error && (
        <p className="text-center text-danger">{error}</p>
      )}

      {/* Si ya hubo una busqueda y no hay resulstados */}
      {searched && !loading && requests.length === 0 && !error && (
        <p className="text-center mt-4">
          No se encontraron solicitudes para este correo.
        </p>
      )}

      {/* Tabla resumen con los resultados */}
      {!loading && requests.length > 0 && (
        <div className="card p-4 shadow-sm">
          <h5 className="fw-bold mb-3">Resultados</h5>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Crédito</th>
                  <th>Monto</th>
                  <th>Plazo</th>
                  <th>Cuota</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.creditType}</td>
                    <td>${req.amount?.toLocaleString("es-CO")}</td>
                    <td>{req.term} meses</td>
                    <td>${req.monthlyFee?.toLocaleString("es-CO")}</td>
                    <td>
                      {req.createdAt?.toDate().toLocaleString() ??
                        "Fecha no disponible"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}

export default MyRequestPage
