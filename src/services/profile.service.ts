import { Patient } from "@/interfaces/user";
import { apiCaller } from "@/utils";

export const getProfileById = async (id: string): Promise<Patient> => {
  try {
    const res = await apiCaller.get(`profile/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface ProfileDTO {
  id: string;
  fullname: string;
  age: number;
  gender: string;
  ic: string;
}

export const updateProfile = async ({
  id,
  fullname,
  age,
  gender,
  ic,
}: ProfileDTO) => {
  try {
    const res = await apiCaller.put(`profile/${id}`, {
      fullname,
      age,
      gender,
      ic,
    });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteProfileById = async (id: string) => {
  try {
    const res = await apiCaller.delete(`profile/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};