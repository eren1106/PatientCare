import { Patient, User } from "@/interfaces/user";
import { apiRequest } from "@/utils/apiRequest";

export const getAllPatients = async (): Promise<User[]> => {
  try {
    const res = await apiRequest.get(`users/patients`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAllPatientsByDoctorId = async (id: string): Promise<Patient[]> => {
  try {
    const res = await apiRequest.get(`users/patients/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};