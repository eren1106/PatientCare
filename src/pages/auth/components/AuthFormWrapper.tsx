import React, { ReactNode } from 'react'
import { HomeIcon } from 'lucide-react'
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface AuthFormWrapperProps {
  isSignup?: boolean;
  children: ReactNode;
}

const AuthFormWrapper = ({ isSignup = false, children }: AuthFormWrapperProps) => {
  return (
    <div className='absolute w-screen h-screen bg-cyan-500 flex items-center justify-center'>
      <Card className='w-96 p-6 shadow-xl'>
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
              Already have an account? <Link to="/login" className='underline'>Log In</Link> here
            </div>
            : <div className='mt-5 text-center'>
              Don't have an account? <Link to="/signup" className='underline'>Sign Up</Link> here
            </div>
        }
      </Card>
    </div>
  )
}

export default AuthFormWrapper