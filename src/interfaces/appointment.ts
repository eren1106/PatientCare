import { AppointmentStatus } from "@/enums";
import { User } from "./user";

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  doctorId: string;
  patientId: string;
  createdDatetime: Date;
  updatedDatetime?: Date;
  patient?: User;
  doctor?: User;
  status: AppointmentStatus;
}
