import { useState, useCallback } from 'react';
import { getCatalogoProductos, ProductoApi } from '../../infrastructure/services/apiService';

export const useCatalogApi = () => {
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await getCatalogoProductos();
      setProductos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el catálogo.');
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    productos,
    cargando,
    error,
    fetchProductos,
  };
};