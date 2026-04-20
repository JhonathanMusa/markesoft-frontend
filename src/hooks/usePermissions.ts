import { useAuth } from '../context/useAuth';

export type AppModule = 'products' | 'users' | 'providers' | 'sales';

const VISIBLE_TABS: Record<string, AppModule[]> = {
  admin: ['products', 'users', 'providers', 'sales'],
  cashier: ['products', 'users', 'providers', 'sales'],
  usuario: ['products', 'providers'],
};

const WRITE_MODULES: Record<string, AppModule[]> = {
  admin: ['products', 'users', 'providers', 'sales'],
  cashier: ['products'],
  usuario: [],
};

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role ?? '';

  const canView = (module: AppModule): boolean =>
    (VISIBLE_TABS[role] ?? []).includes(module);

  const canWrite = (module: AppModule): boolean =>
    (WRITE_MODULES[role] ?? []).includes(module);

  return { canView, canWrite, role };
}
