import LinkButton from "@/components/LinkButton";
import { verifyEmail } from "@/services/auth.service";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const EmailVerificationPage = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  // const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const location = useLocation();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmailAtInit = async () => {
      if (hasVerified.current) return;
      setIsLoading(true);

      hasVerified.current = true;

      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        return;
      }

      try {
        const data = await verifyEmail(token);
        setIsVerified(data.isVerified);
      } catch (error: any) {
        console.error(error);
      }

      setIsLoading(false);
    };

    verifyEmailAtInit();
  }, [location]);

  if (isLoading) return <p>Verifying your email...</p>

  return (
    <div className="flex justify-center items-center">
      <div className="bg-background p-8 rounded-lg shadow-lg text-center flex flex-col gap-4">
        <h2 className="text-2xl">Email Verification</h2>

        {isVerified ? (
          <>
            <p className="text-green-500 text-lg">✅ Email verified successfully!</p>
            <p>You can now log in to your account.</p>
            <LinkButton to="/auth/login">
              Log In
            </LinkButton>
          </>
        ) :
          (
            <p className="text-destructive">❌ Failed to verify your email</p>
          )
        }
      </div>
    </div>
  );
}

export default EmailVerificationPage;