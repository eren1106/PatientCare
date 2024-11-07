import { z } from "zod";

export const PatientExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  reps: z.coerce.number().nonnegative(),
  sets: z.coerce.number().nonnegative(),
  frequency: z.coerce.number().nonnegative(),
  duration: z.coerce.number().nonnegative(),
});
export type PatientExerciseSchemaType = z.infer<typeof PatientExerciseSchema>;