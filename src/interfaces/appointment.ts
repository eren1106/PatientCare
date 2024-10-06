export interface Appointment {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  doctorId: string;
  patientId: string;
  createdDatetime: Date;
  updatedDatetime?: Date;
}
