import { Doctor, Patient, User } from "@/interfaces/user";
import { apiRequest } from "@/utils/apiRequest";
import { setUserToSession } from "./auth.service";

export const getProfileById = async (id: string): Promise<Patient | Doctor> => {
  try {
    const res = await apiRequest.get(`profile/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// export const getDoctorProfileById = async (id: string): Promise<Doctor> => {
//   try {
//     const res = await apiRequest.get(`profile/${id}`);
//     return res.data;
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// };

interface ProfileDTO {
  id: string;
  formData: FormData;
}

export const updateProfile = async ({
  id,
  formData
}: ProfileDTO) => {
  try {
    const res = await apiRequest.put(`profile/${id}`, formData);
    setUserToSession(res.data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteProfileById = async (id: string) => {
  try {
    const res = await apiRequest.delete(`profile/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};