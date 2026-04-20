import { useState } from 'react';
import type { User } from '../modules/users/User.types';
import { getUsers } from '../services/userService';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('auth_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const login = async (email: string) => {
    const res = await getUsers();
    const found = res.data.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!found) throw new Error('No se encontró un usuario con ese correo.');
    setUser(found);
    sessionStorage.setItem('auth_user', JSON.stringify(found));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
