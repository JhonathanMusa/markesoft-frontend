import axiosInstance from '../api/axiosInstance';
import type { User } from '../modules/users/User.types';

export const getUsers = () => axiosInstance.get<User[]>('/users');
export const getUser = (id: number) => axiosInstance.get<User>(`/users/${id}`);
export const createUser = (data: User) => axiosInstance.post<User>('/users', data);
export const updateUser = (id: number, data: User) => axiosInstance.put<User>(`/users/${id}`, data);
export const deleteUser = (id: number) => axiosInstance.delete(`/users/${id}`);
