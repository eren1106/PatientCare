import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/services/auth.service';
import { UserRole } from '@/enums';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== requiredRole) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;