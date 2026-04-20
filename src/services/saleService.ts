import axiosInstance from '../api/axiosInstance';
import type { Sale, SalePayload } from '../modules/sales/Sale.types';

export const getSales = () => axiosInstance.get<Sale[]>('/sales');
export const getSale = (id: number) => axiosInstance.get<Sale>(`/sales/${id}`);
export const createSale = (data: SalePayload) => axiosInstance.post<Sale>('/sales', data);
export const updateSale = (id: number, data: Sale) => axiosInstance.put<Sale>(`/sales/${id}`, data);
export const deleteSale = (id: number) => axiosInstance.delete(`/sales/${id}`);
