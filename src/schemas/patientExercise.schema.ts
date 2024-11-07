import { z } from "zod";

export const PatientExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.coerce.number().nonnegative(),
});
export type PatientExerciseSchemaType = z.infer<typeof PatientExerciseSchema>;