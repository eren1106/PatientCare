import { Appointment } from "@/interfaces/appointment";
import { apiRequest } from "@/utils/apiRequest";

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await apiRequest.get(`appointments`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  try {
    const res = await apiRequest.get(`appointments/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// DTO for creating or updating an appointment
interface AppointmentDTO {
  id?: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  doctorId: string;
  patientId: string;
}

export const createAppointment = async ({
  title,
  description,
  startTime,
  endTime,
  doctorId,
  patientId,
}: AppointmentDTO) => {
  try {
    const res = await apiRequest.post(`appointments`, {
      title,
      description,
      startTime,
      endTime,
      doctorId,
      patientId,
    });
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateAppointment = async ({
  id,
  title,
  description,
  startTime,
  endTime,
  doctorId,
  patientId,
}: AppointmentDTO) => {
  try {
    const res = await apiRequest.put(`appointments/${id}`, {
      title,
      description,
      startTime,
      endTime,
      doctorId,
      patientId,
    });
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteAppointmentById = async (id: string) => {
  try {
    const res = await apiRequest.delete(`appointments/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
