import React, { ReactNode } from 'react'
import { HomeIcon } from 'lucide-react'
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AuthFormWrapperProps {
  isSignup?: boolean;
  children: ReactNode;
  cardClassName?: string;
}

const AuthFormWrapper = ({ isSignup = false, children, cardClassName }: AuthFormWrapperProps) => {
  return (
    <div className='flex items-center justify-center'>
      <Card className={cn('sm:w-96 w-full p-6 shadow-xl overflow-y-auto max-h-[90vh] flex flex-col gap-3', cardClassName)}>
        <h1 className='text-center w-full'>{isSignup ? 'Sign up your account' : 'Welcome to PatientCare'}</h1>
        {children}
        {
          isSignup
            ? <div className='text-center'>
              Already have an account? <Link to="/auth/login" className='underline'>Log In</Link> here
            </div>
            : (
              <>
                <div className='text-center'>
                  Don't have an account? <Link to="/auth/register" className='underline'>Register</Link> here
                </div>
                <div className='text-center'>
                  Forgot your password? <Link to="/auth/request-reset-password" className='underline'>Reset Password</Link> here
                </div>
              </>
            )
        }
      </Card>
    </div>
  )
}

export default AuthFormWrapper