import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import useLoading from '@/hooks/useLoading.hook'
import AuthFormWrapper from './AuthFormWrapper'
import { Form } from '@/components/ui/form'
import GenericFormField from '@/components/GenericFormField'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { registerUser } from "@/services/auth.service"
import { toast } from "@/components/ui/use-toast"
import { RegisterSchema, RegisterSchemaType } from "@/schemas/register.schema"
import { Gender, UserRoleRegister } from "@/enums"

const RegisterForm = () => {
  const navigate = useNavigate();
  const { isLoading, withLoading } = useLoading();


  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    // defaultValues: {
    //   username: "",
    //   email: "",
    //   password: "",
    // },
  })

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      console.log("DATA", data);
      await registerUser(data);

      toast({
        title: "Register Successfully",
        variant: "success"
      });

      navigate("/auth/login");
    }
    catch (e: any) {
      console.log(e);
      toast({
        title: "Failed to register",
        description: `${e}`,
        variant: "destructive"
      })
    }
  }

  return (
    <AuthFormWrapper isSignup={true} cardClassName='sm:w-[40rem]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
            <GenericFormField
              control={form.control}
              name="username"
              label="Username"
              placeholder="Username"
            />
            <GenericFormField
              control={form.control}
              name="fullname"
              label="Fullname"
              placeholder="Fullname"
            />
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
            <GenericFormField
              control={form.control}
              name="ic"
              label="IC"
              placeholder="IC"
            />
            <GenericFormField
              control={form.control}
              name="age"
              label="Age"
              placeholder="Age"
            />
            <GenericFormField
              control={form.control}
              name="gender"
              label="Gender"
              placeholder="Gender"
              type="select"
              options={Object.values(Gender).map(gender => ({
                label: gender,
                value: gender
              }))}
            />
            <GenericFormField
              control={form.control}
              name="role"
              label="Role"
              placeholder="Role"
              type="select"
              options={Object.values(UserRoleRegister).map(role => ({
                label: role,
                value: role
              }))}
            />
          </div>

          {/* TODO: if selected role is doctor, show doctor validation related fields */}

          <Button type="submit" className='w-full' disabled={isLoading}>
            Register
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  )
}

export default RegisterForm


