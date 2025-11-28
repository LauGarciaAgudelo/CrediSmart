import creditsData from '../data/creditsData'
import CreditCard from '../components/CreditCard'

function HomePage() {
  return (
    <main>
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="mb-3">Catálogo de Créditos</h1>
          <p className="lead">Explora nuestras opciones y selecciona la que más te convenga.</p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {creditsData.map((credit) => (
            <div key={credit.id} className="col-12 col-md-6 col-lg-4">
              <CreditCard {...credit} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
