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

const LoginSchema = z.object({
  email: z.string().min(2, "Username or email required at least 2 characters"),
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
    // try {
    //   const { email, password } = data;
    //   const res: any = await signIn("credentials", {
    //     email: email,
    //     password,
    //     redirect: false,
    //   });
    //   console.log({ response: res });
    //   // if (!res?.error) {
    //   //   router.push("/prompts");
    //   //   // router.refresh();
    //   // }

    //   if (res.error) {
    //     // toast({
    //     //   title: res.error,
    //     //   variant: "destructive"
    //     // })
    //     // setLoading(false);
    //     throw new Error(res.error);
    //   }

    //   if (!res.ok) {
    //     // toast({
    //     //   title: "Network response was not ok",
    //     //   variant: "destructive"
    //     // })
    //     // setLoading(false);
    //     throw new Error("Network response was not ok");
    //   }

    //   // Process response here
    //   console.log("Login Successful", res);
    //   toast({ title: "Login Successful" });
    //   navigate("/");
    // }
    // catch (err) {
    //   console.log(err);
    //   toast({
    //     title: String(err),
    //     variant: "destructive"
    //   })
    // }
  }

  return (
    <AuthFormWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <GenericFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Full Name"
          />

          <GenericFormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Full Name"
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