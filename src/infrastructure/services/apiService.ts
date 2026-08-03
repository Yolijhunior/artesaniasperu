import axios from 'axios';

export interface ProductoApi {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  artesano?: string;
  region?: string;
}

const API_URL = 'https://6a6ffcdb55c0ce38c325cb2b.mockapi.io/api/v1/products';

export const getCatalogoProductos = async (): Promise<ProductoApi[]> => {
  try {
    const response = await axios.get(API_URL);
    // Aseguramos que retorne un arreglo, sin importar si viene dentro de response.data
    const data = Array.isArray(response.data) ? response.data : [response.data];
    return data;
  } catch (error: any) {
    console.error('Error detallado al conectar con la API:', error.message || error);
    throw new Error('No se pudo conectar con el servidor.');
  }
}