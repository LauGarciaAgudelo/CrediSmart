function CreditCard({ name, description, annualRate, minAmount, maxAmount, maxTermMonths, image }) {
  return (
    <div className="card credit-card text-center shadow-sm">
      <img src={image} className="card-img-top p-3" alt={name} />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>

        <ul className="list-unstyled small">
          <li>
            <strong>Tasa anual:</strong> {annualRate}%
          </li>
          <li>
            <strong>Monto:</strong> ${minAmount.toLocaleString('es-CO')} - ${maxAmount.toLocaleString('es-CO')}
          </li>
          <li>
            <strong>Plazo máximo:</strong> {maxTermMonths} meses
          </li>
        </ul>
      </div>

      <div className="card-footer bg-white">
        <a href="/solicitar" className="btn btn-outline-primary w-100">
          Solicitar
        </a>
      </div>
    </div>
  );
}

export default CreditCard;