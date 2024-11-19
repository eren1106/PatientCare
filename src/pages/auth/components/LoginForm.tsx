import * as z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import useLoading from '@/hooks/useLoading.hook'
import AuthFormWrapper from './AuthFormWrapper'
import { Form } from '@/components/ui/form'
import GenericFormField from '@/components/GenericFormField'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, loginUser } from "@/services/auth.service"
import { toast } from "@/components/ui/use-toast"
import useCallStore from "@/hooks/useCallStore.hook"
import { UserRole } from "@/enums"

const LoginSchema = z.object({
  email: z.string().min(2, "Email required at least 3 characters"),
  password: z.string().min(6, "Minimim length of password is 6"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { isLoading, withLoading } = useLoading();
  const { initializeDevice } = useCallStore();


  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    // defaultValues: {
    //   username: "",
    //   email: "",
    //   password: "",
    // },
  })

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const { email, password } = data;
      await withLoading(async () => await loginUser(email, password));

      // TODO: Currently it prevent me from login, uncomment this when it is fixed
      // NOTE: No issue, just backend need to setup twilio, this api will require twilio token to work
      //await initializeDevice();

      toast({
        title: "Login Successfully",
        variant: "success"
      });

      const user = getCurrentUser();
      if(user?.role === UserRole.DOCTOR || user?.role === UserRole.ADMIN) {
        navigate("/dashboard");
        return;
      }
      if(user?.role === UserRole.PATIENT) {
        navigate("/");
        return;
      }
    }
    catch (e: any) {
      const errorMessage = e.data?.data?.message || "Failed to login";
      toast({
        title: "Failed to login",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }

  return (
    <AuthFormWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <GenericFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            type="email"
          />

          <GenericFormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />

          <Button type="submit" className='w-full' disabled={isLoading}>
            Log In
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  )
}

export default LoginForm


