import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">CreditSmart</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    'nav-link' + (isActive ? ' active' : '')
                  }
                  end
                >
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/simulador"
                  className={({ isActive }) =>
                    'nav-link' + (isActive ? ' active' : '')
                  }
                >
                  Simulador
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/solicitar"
                  className={({ isActive }) =>
                    'nav-link' + (isActive ? ' active' : '')
                  }
                >
                  Solicitar Crédito
                </NavLink>
                </li>
              <li className="nav-item">
                  <NavLink
                    to="/solicitudes"
                    className={({ isActive})=>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                  >
                    Gestión Solicitudes
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
