import { z } from "zod";

export const RequestResetPasswordSchema = z.object({
  email: z.string().min(2, "Email required at least 3 characters"),
});
export type RequestResetPasswordSchemaType = z.infer<typeof RequestResetPasswordSchema>;
