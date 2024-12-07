import { z } from "zod";

export const ExerciseCategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});
export type ExerciseCategorySchemaType = z.infer<typeof ExerciseCategorySchema>;