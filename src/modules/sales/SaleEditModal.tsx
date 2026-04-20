import { useState } from 'react';
import type { Sale } from './Sale.types';

interface Props {
  sale: Sale;
  onSubmit: (data: Sale) => void;
  onClose: () => void;
}

export default function SaleEditModal({ sale, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Sale>({
    ...sale,
    date: sale.date ? new Date(sale.date).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Venta #{sale.id}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Total ($)</label>
                <input
                  type="text"
                  className="form-control"
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
