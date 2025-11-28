import creditsData from '../data/creditsData'

function HomePage() {
  return (
    <main>
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="mb-3">Catálogo de Créditos</h1>
          <p className="lead">
            Conoce nuestras opciones de crédito y elige la que mejor se adapte a tus necesidades.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {creditsData.map((credit) => (
            <div key={credit.id} className="col-12 col-md-6 col-lg-4">
              <div className="card credit-card text-center">
                <img
                  src={credit.image}
                  className="card-img-top p-3"
                  alt={credit.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{credit.name}</h5>
                  <p className="card-text">{credit.description}</p>
                  <ul className="list-unstyled small">
                    <li>
                      <strong>Tasa anual:</strong> {credit.annualRate}%
                    </li>
                    <li>
                      <strong>Monto:</strong>{' '}
                      ${credit.minAmount.toLocaleString('es-CO')} - $
                      {credit.maxAmount.toLocaleString('es-CO')}
                    </li>
                    <li>
                      <strong>Plazo máximo:</strong> {credit.maxTermMonths} meses
                    </li>
                  </ul>
                </div>
                <div className="card-footer bg-white">
                  {/* Más adelante navegaremos al formulario con info del crédito */}
                  <a href="/solicitar" className="btn btn-outline-primary w-100">
                    Solicitar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
