import { Card } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm.hook';
import { RequestResetPasswordSchema, RequestResetPasswordSchemaType } from '@/schemas/requestResetPasswordSchema';
import ZodForm from '@/components/ZodForm';
import GenericFormField from '@/components/GenericFormField';
import FormButton from '@/components/FormButton';
import { requestResetPassword } from '@/services/auth.service';
import { toast } from '@/components/ui/use-toast';

const RequestResetPasswordPage = () => {
  const form = useZodForm(RequestResetPasswordSchema);

  const onSubmit = async (data: RequestResetPasswordSchemaType) => {
    try {
      await requestResetPassword(data.email);
      toast({
        title: 'Reset link sent',
        description: 'Please check your email for the reset link',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to send reset link',
        description: `${error}`,
        variant: 'destructive',
      })
    }
  };

  return (
    <Card className='shadow-lg flex flex-col gap-4'>
      <h1 className='text-center'>Request Reset Password</h1>
      <ZodForm form={form} onSubmit={onSubmit}>
        <GenericFormField
          name="email"
          type="email"
          control={form.control}
          noLabel
        />

        <FormButton
          className='w-full'
          type="submit"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
        >
          Send Request
        </FormButton>
      </ZodForm>
    </Card>
  );
};

export default RequestResetPasswordPage;
