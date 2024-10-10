import { z } from 'zod';

export const AppointmentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  patientId: z.string(),
});
export type AppointmentSchemaType = z.infer<typeof AppointmentSchema>;
