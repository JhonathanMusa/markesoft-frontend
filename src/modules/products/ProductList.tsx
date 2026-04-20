import { useEffect, useState } from 'react';
import type { Product } from './Product.types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';
import { usePermissions } from '../../hooks/usePermissions';
import ProductForm from './ProductForm';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { canWrite } = usePermissions();

  const refetch = () => setRefetchTrigger((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        if (!cancelled) {
          setProducts(res.data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Error al cargar los productos.');
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

  const handleEdit = (product: Product) => {
    setSelected(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      refetch();
    } catch {
      alert('Error al eliminar el producto.');
    }
  };

  const handleSubmit = async (data: Product) => {
    try {
      if (selected?.id) {
        await updateProduct(selected.id, data);
      } else {
        await createProduct(data);
      }
      setShowModal(false);
      refetch();
    } catch {
      alert('Error al guardar el producto.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Productos</h2>
        {canWrite('products') && (
          <button className="btn btn-success" onClick={handleCreate}>
            + Nuevo Producto
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                {canWrite('products') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={canWrite('products') ? 6 : 5} className="text-center text-muted">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const dimmed = product.stock === 0
                    ? { color: '#aaa' } as React.CSSProperties
                    : undefined;
                  return (
                    <tr key={product.id}>
                      <td style={dimmed}>{product.id}</td>
                      <td style={dimmed}>{product.name}</td>
                      <td style={dimmed}>{product.description}</td>
                      <td style={dimmed}>${Number(product.price).toFixed(2)}</td>
                      <td style={dimmed}>{product.stock}</td>
                      {canWrite('products') && (
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id!)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductForm
          product={selected}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
