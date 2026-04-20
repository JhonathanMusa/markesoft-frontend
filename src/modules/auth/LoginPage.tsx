import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { createUser } from '../../services/userService';
import type { User } from '../users/User.types';

const emptyRegister: User = { name: '', email: '', role: 'usuario' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login
  const [email, setEmail] = useState('');

  // Register
  const [reg, setReg] = useState<User>(emptyRegister);

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReg((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email);
      navigate('/products', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUser(reg);
      await login(reg.email);
      navigate('/products', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setError(null);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div className="card shadow-sm" style={{ width: 420 }}>
        <div className="card-header bg-dark text-white text-center py-4">
          <h3 className="mb-0 fw-bold">🛒 MarketSoft</h3>
          <small className="text-white-50">Sistema de Gestión</small>
        </div>

        <ul className="nav nav-tabs nav-fill">
          <li className="nav-item">
            <button
              className={`nav-link${tab === 'login' ? ' active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Iniciar Sesión
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link${tab === 'register' ? ' active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Registrarse
            </button>
          </li>
        </ul>

        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                Ingresar
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={reg.name}
                  onChange={handleRegChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={reg.email}
                  onChange={handleRegChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Rol</label>
                <select
                  className="form-select"
                  name="role"
                  value={reg.role}
                  onChange={handleRegChange}
                  required
                >
                  <option value="usuario">Usuario</option>
                  <option value="cashier">Cajero</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                Crear cuenta e ingresar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
