import { useNavigate } from 'react-router-dom'

function CreditCard({
  name,
  description,
  annualRate,
  minAmount,
  maxAmount,
  maxTermMonths,
  image
}) {
  const navigate = useNavigate()

  const goToRequest = () => {
    // Enviamos el nombre del crédito al formulario
    navigate('/solicitar', { state: { selectedCredit: name } })
  }

  return (
    <div className="card credit-card text-center shadow-sm">
      <img src={image} className="card-img-top p-3" alt={name} />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>

        <ul className="list-unstyled small">
          <li><strong>Tasa anual:</strong> {annualRate}%</li>
          <li>
            <strong>Monto:</strong> ${minAmount.toLocaleString('es-CO')} - ${maxAmount.toLocaleString('es-CO')}
          </li>
          <li><strong>Plazo máximo:</strong> {maxTermMonths} meses</li>
        </ul>
      </div>

      <div className="card-footer bg-white">
        <button className="btn btn-outline-primary w-100" onClick={goToRequest}>
          Solicitar
        </button>
      </div>
    </div>
  )
}

export default CreditCard
