import axiosInstance from '../api/axiosInstance';
import type { Provider } from '../modules/providers/Provider.types';

export const getProviders = () => axiosInstance.get<Provider[]>('/providers');
export const getProvider = (id: number) => axiosInstance.get<Provider>(`/providers/${id}`);
export const createProvider = (data: Provider) => axiosInstance.post<Provider>('/providers', data);
export const updateProvider = (id: number, data: Provider) => axiosInstance.put<Provider>(`/providers/${id}`, data);
export const deleteProvider = (id: number) => axiosInstance.delete(`/providers/${id}`);
