import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import type { AppModule } from '../hooks/usePermissions';

const TABS: { module: AppModule; path: string; label: string }[] = [
  { module: 'products', path: '/products', label: 'Productos' },
  { module: 'users', path: '/users', label: 'Usuarios' },
  { module: 'providers', path: '/providers', label: 'Proveedores' },
  { module: 'sales', path: '/sales', label: 'Ventas' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { canView } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          🛒 MarketSoft
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {TABS.filter((t) => canView(t.module)).map((t) => (
              <li className="nav-item" key={t.module}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to={t.path}
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small">
                {user.name}
                <span className="badge bg-secondary ms-2">{user.role}</span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
