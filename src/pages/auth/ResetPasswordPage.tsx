import { Card } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm.hook';
import { ResetPasswordSchema, ResetPasswordSchemaType } from '@/schemas/resetPasswordSchema';
import ZodForm from '@/components/ZodForm';
import GenericFormField from '@/components/GenericFormField';
import FormButton from '@/components/FormButton';
import { resetPassword } from '@/services/auth.service';
import { toast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const form = useZodForm(ResetPasswordSchema);
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    if(!token) {
      toast({
        title: 'Failed to send reset link',
        description: 'Token not found',
        variant: 'destructive',
      })
      return;
    }
    try {
      await resetPassword(data.newPassword, token);
      toast({
        title: 'Password reset successfully',
        description: 'You can now login with your new password',
        variant: 'success',
      });

      // Redirect to login page
      navigate('/auth/login');
    } catch (error) {
      toast({
        title: "Failed to reset password",
        description: `${error}`,
        variant: 'destructive',
      })
    }
  };

  return (
    <Card className='shadow-lg flex flex-col gap-6'>
      <h2 className='text-center'>Enter New Password</h2>
      <p className='text-center text-muted-foreground text-sm'>Please enter your new password below. Make sure it is strong and secure.</p>
      <ZodForm form={form} onSubmit={onSubmit}>
        <GenericFormField
          name="newPassword"
          type="password"
          control={form.control}
          noLabel
        />

        <FormButton
          className='w-full'
          type="submit"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
        >
          Submit
        </FormButton>
      </ZodForm>
    </Card>
  );
};

export default ResetPasswordPage;
