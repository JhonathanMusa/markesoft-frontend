import { useEffect, useState } from 'react';
import type { Provider } from './Provider.types';
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from '../../services/providerService';
import { usePermissions } from '../../hooks/usePermissions';
import ProviderForm from './ProviderForm';

export default function ProviderList() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Provider | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { canWrite } = usePermissions();

  const refetch = () => setRefetchTrigger((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getProviders();
        if (!cancelled) {
          setProviders(res.data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Error al cargar los proveedores.');
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

  const handleEdit = (provider: Provider) => {
    setSelected(provider);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este proveedor?')) return;
    try {
      await deleteProvider(id);
      refetch();
    } catch {
      alert('Error al eliminar el proveedor.');
    }
  };

  const handleSubmit = async (data: Provider) => {
    try {
      if (selected?.id) {
        await updateProvider(selected.id, data);
      } else {
        await createProvider(data);
      }
      setShowModal(false);
      refetch();
    } catch {
      alert('Error al guardar el proveedor.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Proveedores</h2>
        {canWrite('providers') && (
          <button className="btn btn-warning" onClick={handleCreate}>
            + Nuevo Proveedor
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                {canWrite('providers') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No hay proveedores registrados.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.id}>
                    <td>{provider.id}</td>
                    <td>{provider.name}</td>
                    <td>{provider.email}</td>
                    <td>{provider.phone}</td>
                    <td>{provider.city}</td>
                    {canWrite('providers') && (
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(provider)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(provider.id!)}
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
        <ProviderForm
          provider={selected}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
