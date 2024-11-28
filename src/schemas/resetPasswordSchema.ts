import { z } from "zod";

export const ResetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Minimim length of password is 6"),
});
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
