'use client'

import * as z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import useLoading from '@/hooks/useLoading.hook'
import AuthFormWrapper from './AuthFormWrapper'
import { Form } from '@/components/ui/form'
import GenericFormField from '@/components/GenericFormField'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { loginUser } from "@/services/auth.service"
import { toast } from "@/components/ui/use-toast"
import { UserRole } from "@/enums"

const LoginSchema = z.object({
  email: z.string().min(2, "Email required at least 3 characters"),
  password: z.string().min(6, "Minimim length of password is 6"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { isLoading, withLoading } = useLoading();

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
      const res = await loginUser(email, password);
      console.log("RES: ", res);
      toast({
        title: "Login Successfully",
        variant: "success"
      });
      if(res.role === UserRole.DOCTOR) {
        navigate("/dashboard");
        return;
      }
      if(res.role === UserRole.PATIENT) {
        navigate("/");
        return;
      }
    }
    catch (err) {
      console.log(err);
      toast({
        title: String(err),
        variant: "destructive"
      })
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