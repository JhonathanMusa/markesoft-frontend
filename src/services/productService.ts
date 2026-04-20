import axiosInstance from '../api/axiosInstance';
import type { Product } from '../modules/products/Product.types';

export const getProducts = () => axiosInstance.get<Product[]>('/products');
export const getProduct = (id: number) => axiosInstance.get<Product>(`/products/${id}`);
export const createProduct = (data: Product) => axiosInstance.post<Product>('/products', data);
export const updateProduct = (id: number, data: Product) => axiosInstance.put<Product>(`/products/${id}`, data);
export const deleteProduct = (id: number) => axiosInstance.delete(`/products/${id}`);
