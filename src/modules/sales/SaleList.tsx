import { useEffect, useState } from 'react';
import type { Sale, SalePayload } from './Sale.types';
import {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
} from '../../services/saleService';
import { usePermissions } from '../../hooks/usePermissions';
import SaleForm from './SaleForm';
import SaleEditModal from './SaleEditModal';

export default function SaleList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState<Sale | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { canWrite } = usePermissions();

  const refetch = () => setRefetchTrigger((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const listRes = await getSales();
        const ids = listRes.data.map((s) => s.id!);
        const details = await Promise.all(ids.map((id) => getSale(id)));
        if (!cancelled) {
          setSales(details.map((r) => r.data));
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Error al cargar las ventas.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refetchTrigger]);

  const handleCreate = async (data: SalePayload) => {
    try {
      await createSale(data);
      setShowCreateModal(false);
      refetch();
    } catch {
      alert('Error al guardar la venta.');
    }
  };

  const handleEdit = (sale: Sale) => {
    setSelected(sale);
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta venta?')) return;
    try {
      await deleteSale(id);
      refetch();
    } catch {
      alert('Error al eliminar la venta.');
    }
  };

  const handleUpdate = async (data: Sale) => {
    try {
      await updateSale(selected!.id!, data);
      setShowEditModal(false);
      refetch();
    } catch {
      alert('Error al actualizar la venta.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Ventas</h2>
        {canWrite('sales') && (
          <button className="btn btn-danger" onClick={() => setShowCreateModal(true)}>
            + Nueva Venta
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Productos</th>
                <th>Total</th>
                {canWrite('sales') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No hay ventas registradas.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{new Date(sale.date).toLocaleDateString('es-CL')}</td>
                    <td>{sale.User?.name ?? `Usuario #${sale.userId}`}</td>
                    <td>
                      {sale.SaleDetails && sale.SaleDetails.length > 0 ? (
                        <ul className="mb-0 ps-3">
                          {sale.SaleDetails.map((d) => (
                            <li key={d.id}>
                              {d.Product?.name ?? `Producto #${d.productId}`} ×{d.quantity} — ${Number(d.price).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">Sin detalle</span>
                      )}
                    </td>
                    <td className="fw-bold">${Number(sale.total).toFixed(2)}</td>
                    {canWrite('sales') && (
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(sale)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(sale.id!)}
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

      {showCreateModal && (
        <SaleForm
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && selected && (
        <SaleEditModal
          sale={selected}
          onSubmit={handleUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
