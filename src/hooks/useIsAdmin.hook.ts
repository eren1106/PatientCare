// hooks/useIsAdmin.ts
import { useState, useEffect } from 'react';
import { USER_SESSION_KEY } from '@/constants';
import { UserRole } from '@/enums';

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userString = sessionStorage.getItem(USER_SESSION_KEY);
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === UserRole.ADMIN);
    }
  }, []);

  return isAdmin;
};