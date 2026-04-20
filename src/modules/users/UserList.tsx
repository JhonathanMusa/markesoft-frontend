import { useEffect, useState } from 'react';
import type { User } from './User.types';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../services/userService';
import { usePermissions } from '../../hooks/usePermissions';
import UserForm from './UserForm';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { canWrite } = usePermissions();

  const refetch = () => setRefetchTrigger((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        if (!cancelled) {
          setUsers(res.data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Error al cargar los usuarios.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refetchTrigger]);

  const handleCreate = () => {
    setSelected(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setSelected(user);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      refetch();
    } catch {
      alert('Error al eliminar el usuario.');
    }
  };

  const handleSubmit = async (data: User) => {
    try {
      if (selected?.id) {
        await updateUser(selected.id, data);
      } else {
        await createUser(data);
      }
      setShowModal(false);
      refetch();
    } catch {
      alert('Error al guardar el usuario.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Usuarios</h2>
        {canWrite('users') && (
          <button className="btn btn-primary" onClick={handleCreate}>
            + Nuevo Usuario
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                {canWrite('users') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-secondary">{user.role}</span>
                    </td>
                    {canWrite('users') && (
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id!)}
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <UserForm
          user={selected}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
