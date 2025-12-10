import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

function MyRequestPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'requests'))
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRequests(data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar las solicitudes. Por favor verifica tu conexión.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  if (loading) {
    return <p className="text-center mt-4">Cargando solicitudes...</p>
  }

  if (error) {
    return <p className="text-center text-danger mt-4">{error}</p>
  }

  if (requests.length === 0) {
    return <p className="text-center mt-4">No hay solicitudes registradas aún.</p>
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Mis solicitudes (pruebas)</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Crédito</th>
              <th>Monto</th>
              <th>Plazo</th>
              <th>Cuota</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.creditType}</td>
                <td>${r.amount?.toLocaleString('es-CO')}</td>
                <td>{r.term} meses</td>
                <td>${r.monthlyFee?.toLocaleString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default MyRequestPage
