import { DoctorRegistrationStatus } from "@/enums";
import { Doctor } from "@/interfaces/user";
import { apiRequest } from "@/utils/apiRequest";


export const getAllDoctorsStatus = async (): Promise<Doctor[]> => {
    try {
      const res = await apiRequest.get(`admin/doctor`);
      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
};

export const updateDoctorsStatus = async (doctorStatus : UpdateDoctorStatus) => {
    try {
      const res = await apiRequest.put(`admin/doctor`, doctorStatus);
      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
};

interface UpdateDoctorStatus {
    doctorId: string;
    status: DoctorRegistrationStatus;
}