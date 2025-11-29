import { useState } from 'react'
import creditsData from '../data/creditsData'
import CreditCard from '../components/CreditCard'

function SimulatorPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [amountRange, setAmountRange] = useState('all')
  const [sortOrder, setSortOrder] = useState('none') // 'none' | 'asc'

  // 1. Filtro por nombre 
  let filteredCredits = creditsData.filter((credit) =>
    credit.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 2. Filtro por rango de monto
  if (amountRange !== 'all') {
    filteredCredits = filteredCredits.filter((credit) => {
      const max = credit.maxAmount

      if (amountRange === 'low') {
        // Créditos con monto máximo hasta 50 millones
        return max <= 50000000
      }
      if (amountRange === 'medium') {
        // Entre 50 y 80 millones
        return max > 50000000 && max <= 80000000
      }
      if (amountRange === 'high') {
        // Más de 80 millones
        return max > 80000000
      }

      return true
    })
  }

  // 3. Ordenar por tasa de interés (menor a mayor)
  if (sortOrder === 'asc') {
    filteredCredits = [...filteredCredits].sort(
      (a, b) => a.annualRate - b.annualRate
    )
  }

  return (
    <main>
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h1 className="mb-3">Simulador de Créditos</h1>
          <p className="lead">
            Usa la búsqueda y los filtros para encontrar el crédito que mejor se ajuste a tus necesidades.
          </p>
        </div>
      </section>

      <section className="py-4">
        <div className="container">

          {/* Filtros */}
          <div className="row mb-4 g-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Buscar por nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Vivienda, Vehículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Rango de monto</label>
              <select
                className="form-select"
                value={amountRange}
                onChange={(e) => setAmountRange(e.target.value)}
              >
                <option value="all">Todos los montos</option>
                <option value="low">Hasta $50.000.000</option>
                <option value="medium">$50.000.001 a $80.000.000</option>
                <option value="high">Más de $80.000.000</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Tasa de interés</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="none">Sin ordenar</option>
                <option value="asc">Menor a mayor</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          {filteredCredits.length === 0 ? (
            <p className="text-center mt-4">
              <strong>No hay créditos disponibles</strong> para los filtros seleccionados.
            </p>
          ) : (
            <div className="row g-4">
              {filteredCredits.map((credit) => (
                <div key={credit.id} className="col-12 col-md-6 col-lg-4">
                  <CreditCard {...credit} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default SimulatorPage
