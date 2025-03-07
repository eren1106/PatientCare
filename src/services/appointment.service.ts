import { Appointment } from "@/interfaces/appointment";
import { AppointmentSchemaType } from "@/schemas/appointment.schema";
import { apiRequest } from "@/utils/apiRequest";

export const getAppointmentsByUserId = async (id: string): Promise<Appointment[]> => {
  try {
    const res = await apiRequest.get(`appointments/user/${id}`);
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
type CreateAppointmentDTO = AppointmentSchemaType & {
  doctorId: string;
}
type UpdateAppointmentDTO = AppointmentSchemaType & {
  id: string;
}

export const createAppointment = async (data: CreateAppointmentDTO) => {
  try {
    const res = await apiRequest.post(`appointments`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateAppointment = async (data: UpdateAppointmentDTO) => {
  const { id, ...updateData } = data
  try {
    const res = await apiRequest.put(`appointments/${id}`, updateData);
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

export const confirmAppointment = async (id: string, confirm: boolean) => {
  try {
    const res = await apiRequest.put(`appointments/${id}/confirm`, { confirm });
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}