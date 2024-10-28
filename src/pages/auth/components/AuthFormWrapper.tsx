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
      <Card className={cn('w-96 p-6 shadow-xl', cardClassName)}>
        <div className='flex justify-between items-center'>
          <h1 className='mb-2 text-center w-full'>{isSignup ? 'Sign up your account' : 'Welcome to PatientCare'}</h1>
          {/* <LinkButton href="/" variant="outline">
         <HomeIcon size={16} />
        </LinkButton> */}
        </div>
        {children}
        {
          isSignup
            ? <div className='mt-5 text-center'>
              Already have an account? <Link to="/auth/login" className='underline'>Log In</Link> here
            </div>
            : <div className='mt-5 text-center'>
              Don't have an account? <Link to="/auth/register" className='underline'>Register</Link> here
            </div>
        }
      </Card>
    </div>
  )
}

export default AuthFormWrapper