import { USER_SESSION_KEY } from '@/constants';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }: {children: ReactNode}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userString = sessionStorage.getItem(USER_SESSION_KEY);
    if (!userString) {
      navigate('/auth/login');
      return;
    }

    const user = JSON.parse(userString);

    if (!user) {
      navigate('/auth/login');
    } 
    // else {
    //   if (user.role === UserRole.DOCTOR) {
    //     navigate(DASHBOARD_ROOT_PATH);
    //   } else if (user.role === UserRole.PATIENT) {
    //     navigate('/');
    //   }
    // }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthProvider;
