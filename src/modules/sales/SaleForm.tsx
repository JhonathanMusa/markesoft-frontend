import { useEffect, useState } from 'react';
import type { SalePayload } from './Sale.types';
import type { Product } from '../products/Product.types';
import type { User } from '../users/User.types';
import { getProducts } from '../../services/productService';
import { getUsers } from '../../services/userService';

interface CartItem {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface Props {
  onSubmit: (data: SalePayload) => void;
  onClose: () => void;
}

export default function SaleForm({ onSubmit, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [userId, setUserId] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([getUsers(), getProducts()]);
        if (!cancelled) {
          setUsers(usersRes.data);
          setProducts(productsRes.data);
          if (usersRes.data.length > 0) setUserId(usersRes.data[0].id!);
          if (productsRes.data.length > 0) setSelectedProductId(productsRes.data[0].id!);
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const addProduct = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { productId: product.id!, name: product.name, unitPrice: Number(product.price), quantity: 1 }];
    });
  };

  const updateQty = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, quantity } : c)));
  };

  const removeItem = (productId: number) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { alert('Agrega al menos un producto.'); return; }
    const payload: SalePayload = {
      userId,
      date,
      items: cart.map((c) => ({
        productId: c.productId,
        quantity: c.quantity,
      })),
    };
    onSubmit(payload);
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Nueva Venta</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {loadingData ? (
            <div className="modal-body text-center py-4">
              <div className="spinner-border text-danger" role="status" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label fw-semibold">Usuario</label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => setUserId(Number(e.target.value))}
                      required
                    >
                      <option value={0} disabled>Seleccionar usuario…</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header fw-semibold">Agregar producto</div>
                  <div className="card-body">
                    <div className="d-flex gap-2">
                      <select
                        className="form-select"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(Number(e.target.value))}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ${Number(p.price).toFixed(2)} (stock: {p.stock})
                          </option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-outline-danger px-4" onClick={addProduct}>
                        + Añadir
                      </button>
                    </div>
                  </div>
                </div>

                {cart.length > 0 && (
                  <table className="table table-sm table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th style={{ width: 110 }}>Cantidad</th>
                        <th>P. Unit.</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.productId}>
                          <td>{item.name}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              className="form-control form-control-sm"
                              value={item.quantity}
                              onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                            />
                          </td>
                          <td>${item.unitPrice.toFixed(2)}</td>
                          <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeItem(item.productId)}
                            >✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-end fw-bold">Total</td>
                        <td className="fw-bold text-danger">${total.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                )}

                {cart.length === 0 && (
                  <p className="text-muted text-center">Sin productos en la venta.</p>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-danger">Crear Venta</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
