import { z } from 'zod';
import { Gender, UserRoleRegister } from '@/enums';

export const RegisterSchema = z.object({
  username: z.string().min(2, "Username required at least 3 characters"),
  fullname: z.string().min(2, "Fullname required at least 3 characters"),
  email: z.string().min(2, "Email required at least 3 characters"),
  password: z.string().min(6, "Minimim length of password is 6"),
  ic: z.string().min(10, "IC required at least 10 characters"),
  age: z.coerce.number().min(1, "Age required at least 1"),
  gender: z.nativeEnum(Gender),
  role: z.nativeEnum(UserRoleRegister),
  registrationNumber: z.string().optional(),
}).refine((data) => {
  if (data.role === UserRoleRegister.DOCTOR) {
    return !!data.registrationNumber;
  }
  return true;
}, {
  message: "Registration number is required for doctors",
  path: ["registrationNumber"],
});;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
