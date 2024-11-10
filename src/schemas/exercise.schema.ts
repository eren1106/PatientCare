import { z } from "zod";

export const ExerciseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string(),
  difficulty: z.string(),
  videoUrl: z.string().min(1),
  exerciseCategoryId: z.string().min(1),
});
export type ExerciseSchemaType = z.infer<typeof ExerciseSchema>;