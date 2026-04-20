import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { AppModule } from '../hooks/usePermissions';
import { usePermissions } from '../hooks/usePermissions';

interface Props {
  children: React.ReactNode;
  module?: AppModule;
}

export default function ProtectedRoute({ children, module }: Props) {
  const { user } = useAuth();
  const { canView } = usePermissions();

  if (!user) return <Navigate to="/login" replace />;
  if (module && !canView(module)) return <Navigate to="/products" replace />;

  return <>{children}</>;
}
